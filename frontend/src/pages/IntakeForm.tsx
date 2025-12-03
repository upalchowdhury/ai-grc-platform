import { useState } from 'react';
import axios from 'axios';
import { CheckCircle, AlertCircle, Loader2 } from 'lucide-react';

export default function IntakeForm() {
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        requestor_name: '',
        requestor_email: '',
        model_used: '',
        model_provider: '',
        use_case: '',
        deployment_type: '',
        data_types: [] as string[],
        data_volume: '',
    });

    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;

        if (type === 'checkbox') {
            const checked = (e.target as HTMLInputElement).checked;
            setFormData(prev => ({
                ...prev,
                data_types: checked
                    ? [...prev.data_types, value]
                    : prev.data_types.filter(t => t !== value)
            }));
        } else {
            setFormData(prev => ({ ...prev, [name]: value }));
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setSuccess(false);

        try {
            await axios.post('http://localhost:8000/intake/', formData);
            setSuccess(true);
            // Reset form
            setFormData({
                title: '',
                description: '',
                requestor_name: '',
                requestor_email: '',
                model_used: '',
                model_provider: '',
                use_case: '',
                deployment_type: '',
                data_types: [],
                data_volume: '',
            });
        } catch (err: any) {
            setError(err.response?.data?.detail || 'Failed to submit request');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-5xl mx-auto">
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-slate-900 tracking-tight">New AI Project Intake</h1>
                <p className="mt-2 text-slate-600">Submit a new AI/ML project for governance review</p>
            </div>

            {/* Success/Error Messages */}
            {success && (
                <div className="mb-6 p-4 bg-emerald-50 border border-emerald-200 rounded-lg flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-emerald-600" />
                    <p className="text-emerald-800 font-medium">Request submitted successfully!</p>
                </div>
            )}

            {error && (
                <div className="mb-6 p-4 bg-rose-50 border border-rose-200 rounded-lg flex items-center gap-3">
                    <AlertCircle className="w-5 h-5 text-rose-600" />
                    <p className="text-rose-800">{error}</p>
                </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">

                {/* Section 1: Basic Information */}
                <div className="bg-slate-50 px-8 py-4 border-b border-slate-200">
                    <h2 className="font-semibold text-slate-700 uppercase text-xs tracking-wider">Basic Information</h2>
                </div>
                <div className="p-8 grid grid-cols-12 gap-6">
                    <div className="col-span-12">
                        <label className="block text-sm font-medium text-slate-700 mb-1.5">Project Title *</label>
                        <input
                            type="text"
                            name="title"
                            value={formData.title}
                            onChange={handleChange}
                            required
                            className="block w-full rounded-lg border-slate-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm py-2.5 px-3 transition-shadow border"
                            placeholder="e.g., Customer Support Chatbot"
                        />
                    </div>

                    <div className="col-span-12">
                        <label className="block text-sm font-medium text-slate-700 mb-1.5">Description</label>
                        <textarea
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            rows={4}
                            className="block w-full rounded-lg border-slate-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm py-2.5 px-3 transition-shadow resize-y border"
                            placeholder="Describe the purpose and functionality of this AI project..."
                        />
                    </div>

                    <div className="col-span-6">
                        <label className="block text-sm font-medium text-slate-700 mb-1.5">Your Name *</label>
                        <input
                            type="text"
                            name="requestor_name"
                            value={formData.requestor_name}
                            onChange={handleChange}
                            required
                            className="block w-full rounded-lg border-slate-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm py-2.5 px-3 border"
                        />
                    </div>

                    <div className="col-span-6">
                        <label className="block text-sm font-medium text-slate-700 mb-1.5">Your Email *</label>
                        <input
                            type="email"
                            name="requestor_email"
                            value={formData.requestor_email}
                            onChange={handleChange}
                            required
                            className="block w-full rounded-lg border-slate-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm py-2.5 px-3 border"
                        />
                    </div>
                </div>

                {/* Section 2: AI Model Details */}
                <div className="bg-slate-50 px-8 py-4 border-b border-slate-200">
                    <h2 className="font-semibold text-slate-700 uppercase text-xs tracking-wider">AI Model Details</h2>
                </div>
                <div className="p-8 grid grid-cols-12 gap-6">
                    <div className="col-span-6">
                        <label className="block text-sm font-medium text-slate-700 mb-1.5">Model Used</label>
                        <select
                            name="model_used"
                            value={formData.model_used}
                            onChange={handleChange}
                            className="block w-full rounded-lg border-slate-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm py-2.5 px-3 border"
                        >
                            <option value="">Select a model</option>
                            <option value="GPT-4">GPT-4</option>
                            <option value="GPT-3.5">GPT-3.5</option>
                            <option value="Claude 3 Opus">Claude 3 Opus</option>
                            <option value="Claude 3 Sonnet">Claude 3 Sonnet</option>
                            <option value="Gemini Pro">Gemini Pro</option>
                            <option value="Custom Model">Custom Model</option>
                            <option value="Other">Other</option>
                        </select>
                    </div>

                    <div className="col-span-6">
                        <label className="block text-sm font-medium text-slate-700 mb-1.5">Model Provider</label>
                        <select
                            name="model_provider"
                            value={formData.model_provider}
                            onChange={handleChange}
                            className="block w-full rounded-lg border-slate-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm py-2.5 px-3 border"
                        >
                            <option value="">Select a provider</option>
                            <option value="OpenAI">OpenAI</option>
                            <option value="Anthropic">Anthropic</option>
                            <option value="Google">Google (Vertex AI)</option>
                            <option value="AWS Bedrock">AWS Bedrock</option>
                            <option value="Azure OpenAI">Azure OpenAI</option>
                            <option value="Self-Hosted">Self-Hosted</option>
                        </select>
                    </div>

                    <div className="col-span-6">
                        <label className="block text-sm font-medium text-slate-700 mb-1.5">Use Case</label>
                        <select
                            name="use_case"
                            value={formData.use_case}
                            onChange={handleChange}
                            className="block w-full rounded-lg border-slate-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm py-2.5 px-3 border"
                        >
                            <option value="">Select use case</option>
                            <option value="Chatbot">Chatbot / Virtual Assistant</option>
                            <option value="Content Generation">Content Generation</option>
                            <option value="Data Analysis">Data Analysis</option>
                            <option value="Code Generation">Code Generation</option>
                            <option value="Translation">Translation</option>
                            <option value="Automation">Process Automation</option>
                            <option value="Other">Other</option>
                        </select>
                    </div>

                    <div className="col-span-6">
                        <label className="block text-sm font-medium text-slate-700 mb-1.5">Deployment Type</label>
                        <select
                            name="deployment_type"
                            value={formData.deployment_type}
                            onChange={handleChange}
                            className="block w-full rounded-lg border-slate-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm py-2.5 px-3 border"
                        >
                            <option value="">Select deployment type</option>
                            <option value="Cloud">Cloud</option>
                            <option value="On-Premise">On-Premise</option>
                            <option value="Hybrid">Hybrid</option>
                        </select>
                    </div>
                </div>

                {/* Section 3: Data Handling */}
                <div className="bg-slate-50 px-8 py-4 border-b border-slate-200">
                    <h2 className="font-semibold text-slate-700 uppercase text-xs tracking-wider">Data Handling</h2>
                </div>
                <div className="p-8 grid grid-cols-12 gap-6">
                    <div className="col-span-12">
                        <label className="block text-sm font-medium text-slate-700 mb-3">Data Types (Check all that apply)</label>
                        <div className="space-y-2">
                            {['PII', 'PHI', 'Financial', 'Intellectual Property', 'Public Data'].map((type) => (
                                <label key={type} className="flex items-center">
                                    <input
                                        type="checkbox"
                                        value={type}
                                        checked={formData.data_types.includes(type)}
                                        onChange={handleChange}
                                        className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 h-4 w-4"
                                    />
                                    <span className="ml-2 text-sm text-slate-700">{type}</span>
                                </label>
                            ))}
                        </div>
                    </div>

                    <div className="col-span-6">
                        <label className="block text-sm font-medium text-slate-700 mb-1.5">Expected Data Volume</label>
                        <select
                            name="data_volume"
                            value={formData.data_volume}
                            onChange={handleChange}
                            className="block w-full rounded-lg border-slate-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm py-2.5 px-3 border"
                        >
                            <option value="">Select volume</option>
                            <option value="Small">Small (&lt; 1GB)</option>
                            <option value="Medium">Medium (1-10GB)</option>
                            <option value="Large">Large (10-100GB)</option>
                            <option value="Very Large">Very Large (&gt; 100GB)</option>
                        </select>
                    </div>
                </div>

                {/* Submit Button */}
                <div className="px-8 py-6 bg-slate-50 border-t border-slate-200 flex justify-end gap-3">
                    <button
                        type="button"
                        className="px-5 py-2.5 border border-slate-300 text-sm font-medium rounded-lg text-slate-700 bg-white hover:bg-slate-50 transition-colors"
                    >
                        Save Draft
                    </button>
                    <button
                        type="submit"
                        disabled={loading}
                        className="inline-flex justify-center items-center px-5 py-2.5 border border-transparent text-sm font-medium rounded-lg shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {loading ? (
                            <>
                                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                Submitting...
                            </>
                        ) : (
                            'Submit Request'
                        )}
                    </button>
                </div>
            </form>
        </div>
    );
}
