import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { CheckCircle, XCircle, AlertCircle, MessageSquare, Loader2, Eye } from 'lucide-react';

const STATUS_COLORS: Record<string, string> = {
    draft: 'bg-slate-100 text-slate-800',
    submitted: 'bg-sky-100 text-sky-800',
    reviewing: 'bg-amber-100 text-amber-800',
    approved: 'bg-emerald-100 text-emerald-800',
    denied: 'bg-rose-100 text-rose-800',
};

const TEAMS = ['Governance', 'Cybersecurity', 'Legal', 'Compliance', 'Architecture'];

interface IntakeRequest {
    id: string;
    title: string;
    status: string;
    requestor_id: string;
    details: {
        requestor_name?: string;
        requestor_email?: string;
        model_used?: string;
        model_provider?: string;
        data_types?: string[];
    };
    risk_score: number;
    created_at: string;
}

interface ReviewTask {
    id: string;
    request_id: string;
    team: string;
    status: string;
    comments: string | null;
}

export default function ReviewerDashboard() {
    const [requests, setRequests] = useState<IntakeRequest[]>([]);
    const [reviewTasks, setReviewTasks] = useState<Record<string, ReviewTask[]>>({});
    const [loading, setLoading] = useState(true);
    const [selectedTeam, setSelectedTeam] = useState('Governance');
    const [actionLoading, setActionLoading] = useState<string | null>(null);

    useEffect(() => {
        fetchRequests();
    }, []);

    const fetchRequests = async () => {
        try {
            setLoading(true);
            const response = await axios.get('http://localhost:8000/intake/');
            const allRequests = response.data;

            // Filter to show reviewing and submitted requests
            const filteredRequests = allRequests.filter(
                (r: IntakeRequest) => r.status === 'reviewing' || r.status === 'submitted'
            );

            setRequests(filteredRequests);

            // Fetch review tasks for each request
            const tasksMap: Record<string, ReviewTask[]> = {};
            for (const req of filteredRequests) {
                try {
                    const taskResponse = await axios.get(`http://localhost:8000/review/${req.id}/tasks`);
                    tasksMap[req.id] = taskResponse.data;
                } catch (err) {
                    tasksMap[req.id] = [];
                }
            }
            setReviewTasks(tasksMap);
        } catch (error) {
            console.error('Failed to fetch requests:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleReviewAction = async (
        requestId: string,
        action: 'approve' | 'reject' | 'request-info',
        comments: string = ''
    ) => {
        setActionLoading(requestId);
        try {
            await axios.post(`http://localhost:8000/review/${requestId}/${action}`, {
                reviewer_id: 'reviewer-123', // Mock reviewer ID - in real app, this would come from auth
                team: selectedTeam,
                comments: comments
            });

            // Show success message
            const actionMessages = {
                approve: 'Request approved successfully!',
                reject: 'Request rejected',
                'request-info': 'Additional information requested'
            };
            alert(actionMessages[action]);

            // Refresh the list
            await fetchRequests();
        } catch (error) {
            console.error(`Failed to ${action} request:`, error);
            alert(`Failed to ${action} request. Please try again.`);
        } finally {
            setActionLoading(null);
        }
    };

    const getTeamTaskStatus = (requestId: string, team: string): string | null => {
        const tasks = reviewTasks[requestId] || [];
        const teamTask = tasks.find(t => t.team === team);
        return teamTask?.status || null;
    };

    return (
        <div className="max-w-7xl mx-auto">
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Reviewer Dashboard</h1>
                <p className="mt-2 text-slate-600">Review and approve AI project requests</p>
            </div>

            {/* Team Selector */}
            <div className="mb-6 flex items-center gap-4">
                <label className="text-sm font-medium text-slate-700">Review as Team:</label>
                <select
                    value={selectedTeam}
                    onChange={(e) => setSelectedTeam(e.target.value)}
                    className="rounded-lg border-slate-300 text-sm py-2 px-4 focus:border-indigo-500 focus:ring-indigo-500"
                >
                    {TEAMS.map(team => (
                        <option key={team} value={team}>{team}</option>
                    ))}
                </select>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-slate-500">Pending Review</p>
                            <p className="text-3xl font-bold text-amber-600 mt-2">
                                {requests.filter(r => r.status === 'reviewing' || r.status === 'submitted').length}
                            </p>
                        </div>
                        <AlertCircle className="w-8 h-8 text-amber-600" />
                    </div>
                </div>

                <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-slate-500">My Team Reviews</p>
                            <p className="text-3xl font-bold text-indigo-600 mt-2">
                                {requests.filter(r => {
                                    const status = getTeamTaskStatus(r.id, selectedTeam);
                                    return status === 'pending' || status === null;
                                }).length}
                            </p>
                        </div>
                        <MessageSquare className="w-8 h-8 text-indigo-600" />
                    </div>
                </div>

                <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-slate-500">Approved by Team</p>
                            <p className="text-3xl font-bold text-emerald-600 mt-2">
                                {requests.filter(r => getTeamTaskStatus(r.id, selectedTeam) === 'approved').length}
                            </p>
                        </div>
                        <CheckCircle className="w-8 h-8 text-emerald-600" />
                    </div>
                </div>
            </div>

            {/* Requests Table */}
            {loading ? (
                <div className="flex justify-center items-center h-64">
                    <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
                </div>
            ) : requests.length === 0 ? (
                <div className="bg-white rounded-xl border border-slate-200 p-12 text-center">
                    <p className="text-slate-600">No requests pending review</p>
                </div>
            ) : (
                <div className="overflow-hidden rounded-xl border border-slate-200 shadow-sm">
                    <table className="min-w-full divide-y divide-slate-200">
                        <thead className="bg-slate-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">
                                    Project
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">
                                    Model
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">
                                    Data Types
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">
                                    Status
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">
                                    {selectedTeam} Review
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-slate-100">
                            {requests.map((request) => {
                                const teamTaskStatus = getTeamTaskStatus(request.id, selectedTeam);
                                const isLoading = actionLoading === request.id;

                                return (
                                    <tr key={request.id} className="hover:bg-slate-50 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="text-sm font-medium text-slate-900">{request.title}</div>
                                            <div className="text-sm text-slate-500">{request.details?.requestor_name || request.requestor_id}</div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm text-slate-900">{request.details?.model_used || 'N/A'}</div>
                                            <div className="text-sm text-slate-500">{request.details?.model_provider || ''}</div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex flex-wrap gap-1">
                                                {request.details?.data_types?.slice(0, 2).map(type => (
                                                    <span key={type} className="inline-flex px-2 py-0.5 text-xs font-medium rounded bg-slate-100 text-slate-800">
                                                        {type}
                                                    </span>
                                                ))}
                                                {(request.details?.data_types?.length || 0) > 2 && (
                                                    <span className="text-xs text-slate-500">+{(request.details?.data_types?.length || 0) - 2}</span>
                                                )}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${STATUS_COLORS[request.status] || 'bg-slate-100 text-slate-800'}`}>
                                                {request.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            {teamTaskStatus ? (
                                                <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${teamTaskStatus === 'approved' ? 'bg-emerald-100 text-emerald-800' :
                                                    teamTaskStatus === 'rejected' ? 'bg-rose-100 text-rose-800' :
                                                        teamTaskStatus === 'needs-info' ? 'bg-amber-100 text-amber-800' :
                                                            'bg-slate-100 text-slate-800'
                                                    }`}>
                                                    {teamTaskStatus}
                                                </span>
                                            ) : (
                                                <span className="text-xs text-slate-500">Not reviewed</span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center gap-2">
                                                <Link
                                                    to={`/requests/${request.id}`}
                                                    className="text-indigo-600 hover:text-indigo-900 inline-flex items-center gap-1"
                                                >
                                                    <Eye className="w-4 h-4" />
                                                </Link>

                                                {!teamTaskStatus || teamTaskStatus === 'pending' ? (
                                                    <>
                                                        <button
                                                            onClick={() => handleReviewAction(request.id, 'approve')}
                                                            disabled={isLoading}
                                                            className="text-emerald-600 hover:text-emerald-900 disabled:opacity-50"
                                                            title="Approve"
                                                        >
                                                            <CheckCircle className="w-5 h-5" />
                                                        </button>
                                                        <button
                                                            onClick={() => handleReviewAction(request.id, 'reject', 'Does not meet requirements')}
                                                            disabled={isLoading}
                                                            className="text-rose-600 hover:text-rose-900 disabled:opacity-50"
                                                            title="Reject"
                                                        >
                                                            <XCircle className="w-5 h-5" />
                                                        </button>
                                                        <button
                                                            onClick={() => handleReviewAction(request.id, 'request-info', 'Additional information needed')}
                                                            disabled={isLoading}
                                                            className="text-amber-600 hover:text-amber-900 disabled:opacity-50"
                                                            title="Request Info"
                                                        >
                                                            <AlertCircle className="w-5 h-5" />
                                                        </button>
                                                    </>
                                                ) : (
                                                    <span className="text-xs text-slate-500">Reviewed</span>
                                                )}

                                                {isLoading && <Loader2 className="w-4 h-4 animate-spin text-indigo-600" />}
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}
