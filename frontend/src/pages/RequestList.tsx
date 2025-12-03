import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { Eye, Filter, Loader2 } from 'lucide-react';

const STATUS_COLORS: Record<string, string> = {
    draft: 'bg-slate-100 text-slate-800',
    submitted: 'bg-sky-100 text-sky-800',
    reviewing: 'bg-amber-100 text-amber-800',
    approved: 'bg-emerald-100 text-emerald-800',
    denied: 'bg-rose-100 text-rose-800',
};

interface IntakeRequest {
    id: string;
    title: string;
    status: string;
    requestor_id: string;
    details: {
        requestor_name?: string;
        model_used?: string;
        model_provider?: string;
    };
    risk_score: number;
    created_at: string;
}

export default function RequestList() {
    const [requests, setRequests] = useState<IntakeRequest[]>([]);
    const [loading, setLoading] = useState(true);
    const [statusFilter, setStatusFilter] = useState('');

    useEffect(() => {
        fetchRequests();
    }, [statusFilter]);

    const fetchRequests = async () => {
        try {
            setLoading(true);
            const params = statusFilter ? { status: statusFilter } : {};
            const response = await axios.get('http://localhost:8000/intake/', { params });
            setRequests(response.data);
        } catch (error) {
            console.error('Failed to fetch requests:', error);
        } finally {
            setLoading(false);
        }
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
        });
    };

    return (
        <div className="max-w-7xl mx-auto">
            {/* Header */}
            <div className="mb-8 flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900 tracking-tight">My Requests</h1>
                    <p className="mt-2 text-slate-600">View and manage your AI project intake requests</p>
                </div>
                <Link
                    to="/"
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg shadow-sm text-white bg-indigo-600 hover:bg-indigo-700"
                >
                    New Request
                </Link>
            </div>

            {/* Filters */}
            <div className="mb-6 flex gap-4">
                <div className="flex items-center gap-2">
                    <Filter className="w-4 h-4 text-slate-500" />
                    <label className="text-sm font-medium text-slate-700">Status:</label>
                    <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="rounded-lg border-slate-300 text-sm py-1.5 px-3 focus:border-indigo-500 focus:ring-indigo-500"
                    >
                        <option value="">All</option>
                        <option value="draft">Draft</option>
                        <option value="submitted">Submitted</option>
                        <option value="reviewing">Reviewing</option>
                        <option value="approved">Approved</option>
                        <option value="denied">Denied</option>
                    </select>
                </div>
            </div>

            {/* Table */}
            {loading ? (
                <div className="flex justify-center items-center h-64">
                    <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
                </div>
            ) : requests.length === 0 ? (
                <div className="bg-white rounded-xl border border-slate-200 p-12 text-center">
                    <p className="text-slate-600">No requests found</p>
                </div>
            ) : (
                <div className="overflow-hidden rounded-xl border border-slate-200 shadow-sm">
                    <table className="min-w-full divide-y divide-slate-200">
                        <thead className="bg-slate-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">
                                    Title
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">
                                    Model
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">
                                    Status
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">
                                    Risk Score
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">
                                    Created
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-slate-100">
                            {requests.map((request) => (
                                <tr key={request.id} className="hover:bg-slate-50 transition-colors">
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm font-medium text-slate-900">{request.title}</div>
                                        <div className="text-sm text-slate-500">{request.details?.requestor_name || request.requestor_id}</div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm text-slate-900">{request.details?.model_used || 'N/A'}</div>
                                        <div className="text-sm text-slate-500">{request.details?.model_provider || ''}</div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${STATUS_COLORS[request.status] || 'bg-slate-100 text-slate-800'}`}>
                                            {request.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm text-slate-900">{request.risk_score || 0}/100</div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                                        {formatDate(request.created_at)}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                                        <Link
                                            to={`/requests/${request.id}`}
                                            className="text-indigo-600 hover:text-indigo-900 inline-flex items-center gap-1"
                                        >
                                            <Eye className="w-4 h-4" />
                                            View
                                        </Link>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}
