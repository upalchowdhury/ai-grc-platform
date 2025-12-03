import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { ArrowLeft, Loader2, Shield, TrendingUp } from 'lucide-react';

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
    description: string;
    status: string;
    requestor_id: string;
    risk_score: number;
    created_at: string;
    updated_at: string;
    details: {
        requestor_name?: string;
        requestor_email?: string;
        model_used?: string;
        model_provider?: string;
        use_case?: string;
        deployment_type?: string;
        data_types?: string[];
        data_volume?: string;
    };
}

interface RiskScoreBreakdown {
    id: string;
    request_id: string;
    nist_score: number;
    soc2_score: number;
    sox_score: number;
    owasp_score: number;
    maestro_score: number;
    total_score: number;
    created_at: string;
}

export default function RequestDetail() {
    const { id } = useParams<{ id: string }>();
    const [request, setRequest] = useState<IntakeRequest | null>(null);
    const [riskBreakdown, setRiskBreakdown] = useState<RiskScoreBreakdown | null>(null);
    const [loading, setLoading] = useState(true);
    const [computingRisk, setComputingRisk] = useState(false);

    useEffect(() => {
        fetchRequest();
        fetchRiskBreakdown();
    }, [id]);

    const fetchRequest = async () => {
        try {
            const response = await axios.get(`http://localhost:8000/intake/${id}`);
            setRequest(response.data);
        } catch (error) {
            console.error('Failed to fetch request:', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchRiskBreakdown = async () => {
        try {
            const response = await axios.get(`http://localhost:8000/scoring/${id}`);
            setRiskBreakdown(response.data);
        } catch (error) {
            // Risk score not computed yet, that's okay
            console.log('Risk score not yet computed');
        }
    };

    const handleComputeRisk = async () => {
        setComputingRisk(true);
        try {
            const response = await axios.post(`http://localhost:8000/scoring/${id}/compute`);
            setRiskBreakdown(response.data);
            // Also refresh the request to get updated risk_score
            await fetchRequest();
            alert('Risk score computed successfully!');
        } catch (error) {
            console.error('Failed to compute risk score:', error);
            alert('Failed to compute risk score');
        } finally {
            setComputingRisk(false);
        }
    };

    const getRiskColor = (score: number): string => {
        if (score < 30) return 'text-emerald-600';
        if (score < 60) return 'text-amber-600';
        return 'text-rose-600';
    };

    const getRiskLabel = (score: number): string => {
        if (score < 30) return 'Low Risk';
        if (score < 60) return 'Medium Risk';
        return 'High Risk';
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
            </div>
        );
    }

    if (!request) {
        return (
            <div className="text-center py-12">
                <p className="text-slate-600">Request not found</p>
                <Link to="/requests" className="text-indigo-600 hover:text-indigo-900 mt-4 inline-block">
                    ← Back to Requests
                </Link>
            </div>
        );
    }

    return (
        <div className="max-w-5xl mx-auto">
            {/* Back Button */}
            <Link
                to="/requests"
                className="inline-flex items-center gap-2 text-slate-600 hover:text-slate-900 mb-6"
            >
                <ArrowLeft className="w-4 h-4" />
                Back to Requests
            </Link>

            {/* Header */}
            <div className="mb-8 flex justify-between items-start">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900 tracking-tight">{request.title}</h1>
                    <p className="mt-2 text-slate-600">
                        Submitted by {request.details?.requestor_name || request.requestor_id}
                    </p>
                </div>
                <span className={`inline-flex px-3 py-1 text-sm font-medium rounded-full ${STATUS_COLORS[request.status] || 'bg-slate-100 text-slate-800'}`}>
                    {request.status}
                </span>
            </div>

            {/* Content */}
            <div className="space-y-6">
                {/* Risk Score Summary */}
                <div className="bg-gradient-to-br from-indigo-50 to-violet-50 rounded-xl shadow-sm border border-indigo-200 p-6">
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                            <Shield className="w-6 h-6 text-indigo-600" />
                            <h2 className="text-lg font-semibold text-slate-900">Risk Assessment</h2>
                        </div>
                        <button
                            onClick={handleComputeRisk}
                            disabled={computingRisk}
                            className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 disabled:opacity-50 transition-colors"
                        >
                            {computingRisk ? (
                                <>
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                    Computing...
                                </>
                            ) : (
                                <>
                                    <TrendingUp className="w-4 h-4" />
                                    {riskBreakdown ? 'Re-compute' : 'Compute'} Risk Score
                                </>
                            )}
                        </button>
                    </div>

                    {riskBreakdown ? (
                        <div>
                            {/* Total Score */}
                            <div className="mb-6 text-center">
                                <div className={`text-5xl font-bold ${getRiskColor(riskBreakdown.total_score)}`}>
                                    {riskBreakdown.total_score}
                                </div>
                                <div className="text-sm text-slate-600 mt-1">{getRiskLabel(riskBreakdown.total_score)}</div>
                            </div>

                            {/* Framework Breakdown */}
                            <div className="grid grid-cols-5 gap-4">
                                <div className="bg-white rounded-lg p-4 text-center border border-slate-200">
                                    <div className="text-xs font-medium text-slate-500 uppercase mb-1">NIST AI RMF</div>
                                    <div className={`text-2xl font-bold ${getRiskColor(riskBreakdown.nist_score)}`}>
                                        {riskBreakdown.nist_score}
                                    </div>
                                    <div className="text-xs text-slate-500">/ 100</div>
                                </div>

                                <div className="bg-white rounded-lg p-4 text-center border border-slate-200">
                                    <div className="text-xs font-medium text-slate-500 uppercase mb-1">SOC2</div>
                                    <div className={`text-2xl font-bold ${getRiskColor(riskBreakdown.soc2_score)}`}>
                                        {riskBreakdown.soc2_score}
                                    </div>
                                    <div className="text-xs text-slate-500">/ 100</div>
                                </div>

                                <div className="bg-white rounded-lg p-4 text-center border border-slate-200">
                                    <div className="text-xs font-medium text-slate-500 uppercase mb-1">SOX</div>
                                    <div className={`text-2xl font-bold ${getRiskColor(riskBreakdown.sox_score)}`}>
                                        {riskBreakdown.sox_score}
                                    </div>
                                    <div className="text-xs text-slate-500">/ 100</div>
                                </div>

                                <div className="bg-white rounded-lg p-4 text-center border border-slate-200">
                                    <div className="text-xs font-medium text-slate-500 uppercase mb-1">OWASP</div>
                                    <div className={`text-2xl font-bold ${getRiskColor(riskBreakdown.owasp_score)}`}>
                                        {riskBreakdown.owasp_score}
                                    </div>
                                    <div className="text-xs text-slate-500">/ 100</div>
                                </div>

                                <div className="bg-white rounded-lg p-4 text-center border border-slate-200">
                                    <div className="text-xs font-medium text-slate-500 uppercase mb-1">MAESTRO</div>
                                    <div className={`text-2xl font-bold ${getRiskColor(riskBreakdown.maestro_score)}`}>
                                        {riskBreakdown.maestro_score}
                                    </div>
                                    <div className="text-xs text-slate-500">/ 100</div>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="text-center py-8">
                            <p className="text-slate-600 mb-3">Risk score not yet computed</p>
                            <p className="text-sm text-slate-500">Click "Compute Risk Score" to calculate assessment</p>
                        </div>
                    )}
                </div>

                {/* Basic Information */}
                <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                    <h2 className="text-lg font-semibold text-slate-900 mb-4">Basic Information</h2>
                    <dl className="grid grid-cols-2 gap-4">
                        <div>
                            <dt className="text-sm font-medium text-slate-500">Description</dt>
                            <dd className="mt-1 text-sm text-slate-900">{request.description || 'N/A'}</dd>
                        </div>
                        <div>
                            <dt className="text-sm font-medium text-slate-500">Requestor Email</dt>
                            <dd className="mt-1 text-sm text-slate-900">{request.details?.requestor_email || request.requestor_id}</dd>
                        </div>
                        <div>
                            <dt className="text-sm font-medium text-slate-500">Created At</dt>
                            <dd className="mt-1 text-sm text-slate-900">
                                {new Date(request.created_at).toLocaleString()}
                            </dd>
                        </div>
                        <div>
                            <dt className="text-sm font-medium text-slate-500">Overall Risk Score</dt>
                            <dd className={`mt-1 text-sm font-semibold ${getRiskColor(request.risk_score || 0)}`}>
                                {request.risk_score || 0}/100
                            </dd>
                        </div>
                    </dl>
                </div>

                {/* AI Model Details */}
                <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                    <h2 className="text-lg font-semibold text-slate-900 mb-4">AI Model Details</h2>
                    <dl className="grid grid-cols-2 gap-4">
                        <div>
                            <dt className="text-sm font-medium text-slate-500">Model Used</dt>
                            <dd className="mt-1 text-sm text-slate-900">{request.details?.model_used || 'N/A'}</dd>
                        </div>
                        <div>
                            <dt className="text-sm font-medium text-slate-500">Model Provider</dt>
                            <dd className="mt-1 text-sm text-slate-900">{request.details?.model_provider || 'N/A'}</dd>
                        </div>
                        <div>
                            <dt className="text-sm font-medium text-slate-500">Use Case</dt>
                            <dd className="mt-1 text-sm text-slate-900">{request.details?.use_case || 'N/A'}</dd>
                        </div>
                        <div>
                            <dt className="text-sm font-medium text-slate-500">Deployment Type</dt>
                            <dd className="mt-1 text-sm text-slate-900">{request.details?.deployment_type || 'N/A'}</dd>
                        </div>
                    </dl>
                </div>

                {/* Data Handling */}
                <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                    <h2 className="text-lg font-semibold text-slate-900 mb-4">Data Handling</h2>
                    <dl className="grid grid-cols-2 gap-4">
                        <div>
                            <dt className="text-sm font-medium text-slate-500">Data Types</dt>
                            <dd className="mt-1">
                                {request.details?.data_types && request.details.data_types.length > 0 ? (
                                    <div className="flex flex-wrap gap-2">
                                        {request.details.data_types.map((type) => (
                                            <span
                                                key={type}
                                                className="inline-flex px-2 py-1 text-xs font-medium rounded bg-slate-100 text-slate-800"
                                            >
                                                {type}
                                            </span>
                                        ))}
                                    </div>
                                ) : (
                                    <span className="text-sm text-slate-900">N/A</span>
                                )}
                            </dd>
                        </div>
                        <div>
                            <dt className="text-sm font-medium text-slate-500">Data Volume</dt>
                            <dd className="mt-1 text-sm text-slate-900">{request.details?.data_volume || 'N/A'}</dd>
                        </div>
                    </dl>
                </div>
            </div>
        </div>
    );
}
