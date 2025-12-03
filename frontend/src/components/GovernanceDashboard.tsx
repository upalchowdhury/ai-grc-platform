import { useEffect, useState } from 'react';
import axios from 'axios';
import { CheckCircle2, XCircle, Clock, ChevronRight, FileText } from 'lucide-react';
import { cn } from '../lib/utils';

interface IntakeRequest {
    id: string;
    title: string;
    description: string;
    status: string;
    requestor_id: string;
    details: any;
    created_at: string;
}

export function GovernanceDashboard() {
    const [requests, setRequests] = useState<IntakeRequest[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchRequests();
    }, []);

    const fetchRequests = async () => {
        try {
            const response = await axios.get('http://localhost:8000/intake/');
            setRequests(response.data);
        } catch (error) {
            console.error('Failed to fetch requests', error);
        } finally {
            setLoading(false);
        }
    };

    const handleReview = async (requestId: string, status: 'approved' | 'rejected') => {
        try {
            // Create a review task with the decision
            await axios.post('http://localhost:8000/review/', {
                request_id: requestId,
                team: 'Governance', // Default team for now
                status: status,
                reviewer_id: 'admin-user' // Mock ID
            });

            // Refresh requests (in a real app, we'd update the request status too)
            alert(`Request ${status} successfully!`);
            fetchRequests();
        } catch (error) {
            console.error('Failed to submit review', error);
            alert('Failed to submit review');
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'approved': return 'text-green-600 bg-green-50 border-green-200';
            case 'rejected': return 'text-red-600 bg-red-50 border-red-200';
            case 'reviewing': return 'text-blue-600 bg-blue-50 border-blue-200';
            default: return 'text-gray-600 bg-gray-50 border-gray-200';
        }
    };

    return (
        <div className="max-w-6xl mx-auto pb-20">
            <div className="mb-8 flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Governance Dashboard</h1>
                    <p className="mt-2 text-gray-600">Review and manage AI system intake requests.</p>
                </div>
                <div className="flex gap-4">
                    <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex items-center gap-3">
                        <div className="p-2 bg-blue-50 rounded-lg text-blue-600">
                            <Clock className="w-5 h-5" />
                        </div>
                        <div>
                            <p className="text-xs text-gray-500 font-medium uppercase">Pending</p>
                            <p className="text-xl font-bold text-gray-900">{requests.filter(r => r.status === 'draft' || r.status === 'submitted').length}</p>
                        </div>
                    </div>
                    <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex items-center gap-3">
                        <div className="p-2 bg-green-50 rounded-lg text-green-600">
                            <CheckCircle2 className="w-5 h-5" />
                        </div>
                        <div>
                            <p className="text-xs text-gray-500 font-medium uppercase">Approved</p>
                            <p className="text-xl font-bold text-gray-900">{requests.filter(r => r.status === 'approved').length}</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-gray-50 border-b border-gray-200">
                                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Project Name</th>
                                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Requestor</th>
                                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Department</th>
                                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Risk Level</th>
                                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {loading ? (
                                <tr>
                                    <td colSpan={6} className="px-6 py-8 text-center text-gray-500">Loading requests...</td>
                                </tr>
                            ) : requests.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="px-6 py-8 text-center text-gray-500">No requests found.</td>
                                </tr>
                            ) : (
                                requests.map((request) => (
                                    <tr key={request.id} className="hover:bg-gray-50 transition-colors group">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="p-2 bg-indigo-50 rounded-lg text-indigo-600 group-hover:bg-indigo-100 transition-colors">
                                                    <FileText className="w-5 h-5" />
                                                </div>
                                                <div>
                                                    <p className="font-medium text-gray-900">{request.title}</p>
                                                    <p className="text-xs text-gray-500 truncate max-w-[200px]">{request.description}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-600">{request.requestor_id}</td>
                                        <td className="px-6 py-4 text-sm text-gray-600">{request.details?.department || 'N/A'}</td>
                                        <td className="px-6 py-4">
                                            <span className={cn(
                                                "px-2.5 py-1 rounded-full text-xs font-medium border",
                                                request.details?.data_sensitivity === 'Public' ? "bg-green-50 text-green-700 border-green-200" :
                                                    request.details?.data_sensitivity === 'Internal' ? "bg-blue-50 text-blue-700 border-blue-200" :
                                                        "bg-red-50 text-red-700 border-red-200"
                                            )}>
                                                {request.details?.data_sensitivity || 'Unknown'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={cn(
                                                "px-2.5 py-1 rounded-full text-xs font-medium border capitalize",
                                                getStatusColor(request.status)
                                            )}>
                                                {request.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex justify-end gap-2">
                                                <button
                                                    onClick={() => handleReview(request.id, 'approved')}
                                                    className="p-2 text-green-600 hover:bg-green-50 rounded-lg border border-transparent hover:border-green-200 transition-all"
                                                    title="Approve"
                                                >
                                                    <CheckCircle2 className="w-5 h-5" />
                                                </button>
                                                <button
                                                    onClick={() => handleReview(request.id, 'rejected')}
                                                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg border border-transparent hover:border-red-200 transition-all"
                                                    title="Reject"
                                                >
                                                    <XCircle className="w-5 h-5" />
                                                </button>
                                                <button className="p-2 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all">
                                                    <ChevronRight className="w-5 h-5" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
