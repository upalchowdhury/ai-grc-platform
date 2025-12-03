import { useState } from 'react';
import { Info, CheckCircle2, ChevronRight, ChevronLeft, AlertCircle } from 'lucide-react';
import { cn } from '../lib/utils';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export function IntakeForm() {
    const navigate = useNavigate();
    const [currentStep, setCurrentStep] = useState(1);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const [formData, setFormData] = useState({
        title: '',
        description: '',
        requestor_id: '',
        department: '',
        data_sensitivity: 'Internal',
        ai_model_provider: 'OpenAI',
        pii_involved: false,
        customer_data_involved: false,
        expected_user_base: 'Internal Only',
        business_impact: '',
        vendor_name: '',
        // Extra fields for UI but mapped to backend
        launch_date: '',
        problem_statement: ''
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
        }));
    };

    const handleSubmit = async () => {
        setLoading(true);
        setError(null);
        try {
            // Map to backend expected format
            const payload = {
                title: formData.title,
                description: formData.description,
                requestor_id: formData.requestor_id || 'user-123', // Default for now
                department: formData.department,
                data_sensitivity: formData.data_sensitivity,
                ai_model_provider: formData.ai_model_provider,
                pii_involved: formData.pii_involved,
                customer_data_involved: formData.customer_data_involved,
                expected_user_base: formData.expected_user_base,
                business_impact: formData.business_impact,
                vendor_name: formData.vendor_name
            };

            await axios.post('http://localhost:8000/intake/', payload);
            navigate('/governance'); // Redirect to governance dashboard after success
        } catch (err) {
            setError('Failed to submit intake form. Please try again.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const sections = [
        { id: 1, title: 'Project Basics', description: 'Core information' },
        { id: 2, title: 'Risk Assessment', description: 'Impact analysis' },
        { id: 3, title: 'Technical Details', description: 'Architecture' },
        { id: 4, title: 'Compliance', description: 'Regulatory' },
    ];

    const nextStep = () => setCurrentStep(prev => Math.min(prev + 1, 4));
    const prevStep = () => setCurrentStep(prev => Math.max(prev - 1, 1));

    return (
        <div className="max-w-5xl mx-auto pb-20">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900">New AI System Intake</h1>
                <p className="mt-2 text-gray-600">Complete this assessment to register a new AI system. (Step {currentStep} of 4)</p>
            </div>

            {/* Progress Steps */}
            <div className="mb-12">
                <div className="flex items-center justify-between relative">
                    <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-0.5 bg-gray-200 -z-10" />
                    {sections.map((section) => (
                        <div key={section.id} className="flex flex-col items-center bg-gray-50 px-4 z-10">
                            <div className={cn(
                                "w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold border-2 transition-all duration-300",
                                currentStep >= section.id
                                    ? "bg-indigo-600 border-indigo-600 text-white shadow-lg scale-110"
                                    : "bg-white border-gray-300 text-gray-500"
                            )}>
                                {currentStep > section.id ? <CheckCircle2 className="w-6 h-6" /> : section.id}
                            </div>
                            <span className={cn(
                                "mt-2 text-sm font-medium transition-colors duration-300",
                                currentStep >= section.id ? "text-indigo-600" : "text-gray-500"
                            )}>{section.title}</span>
                        </div>
                    ))}
                </div>
            </div>

            <div className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden transition-all duration-500">
                <div className="p-8 min-h-[600px]">

                    {error && (
                        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-3 text-red-700">
                            <AlertCircle className="w-5 h-5" />
                            {error}
                        </div>
                    )}

                    {/* Step 1: Project Basics */}
                    {currentStep === 1 && (
                        <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
                            <div className="border-b border-gray-100 pb-4">
                                <h2 className="text-2xl font-semibold text-gray-900">Project Information</h2>
                                <p className="text-gray-500 mt-1">Please provide the fundamental details of the AI initiative.</p>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="col-span-2 space-y-2">
                                    <label className="block text-sm font-medium text-gray-700">Project Name *</label>
                                    <input
                                        name="title"
                                        value={formData.title}
                                        onChange={handleChange}
                                        type="text"
                                        className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
                                        placeholder="e.g., Customer Service Chatbot"
                                    />
                                </div>

                                <div className="col-span-2 space-y-2">
                                    <label className="block text-sm font-medium text-gray-700">Description *</label>
                                    <textarea
                                        name="description"
                                        value={formData.description}
                                        onChange={handleChange}
                                        rows={4}
                                        className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
                                        placeholder="Describe the purpose and functionality..."
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="block text-sm font-medium text-gray-700">Business Unit *</label>
                                    <select
                                        name="department"
                                        value={formData.department}
                                        onChange={handleChange}
                                        className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
                                    >
                                        <option value="">Select Unit...</option>
                                        <option value="Engineering">Engineering</option>
                                        <option value="Product">Product</option>
                                        <option value="Marketing">Marketing</option>
                                        <option value="HR">HR</option>
                                        <option value="Finance">Finance</option>
                                        <option value="Legal">Legal</option>
                                    </select>
                                </div>

                                <div className="space-y-2">
                                    <label className="block text-sm font-medium text-gray-700">Project Owner *</label>
                                    <input
                                        name="requestor_id"
                                        value={formData.requestor_id}
                                        onChange={handleChange}
                                        type="text"
                                        className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
                                        placeholder="email@company.com"
                                    />
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Step 2: Risk Assessment */}
                    {currentStep === 2 && (
                        <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
                            <div className="border-b border-gray-100 pb-4">
                                <h2 className="text-2xl font-semibold text-gray-900">Risk & Data Classification</h2>
                                <p className="text-gray-500 mt-1">Assess the potential risks and data sensitivity.</p>
                            </div>

                            <div className="space-y-6">
                                <h3 className="text-lg font-medium text-gray-900">Data Types Processed</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="flex items-start gap-3 p-4 border border-gray-200 rounded-xl hover:border-indigo-500 hover:bg-indigo-50/30 cursor-pointer transition-all">
                                        <input
                                            name="pii_involved"
                                            checked={formData.pii_involved}
                                            onChange={handleChange}
                                            type="checkbox"
                                            className="mt-1 w-5 h-5 text-indigo-600 rounded focus:ring-indigo-500"
                                        />
                                        <div>
                                            <span className="block text-sm font-medium text-gray-900">PII (Personally Identifiable Info)</span>
                                            <span className="block text-xs text-gray-500">Names, emails, phones</span>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-3 p-4 border border-gray-200 rounded-xl hover:border-indigo-500 hover:bg-indigo-50/30 cursor-pointer transition-all">
                                        <input
                                            name="customer_data_involved"
                                            checked={formData.customer_data_involved}
                                            onChange={handleChange}
                                            type="checkbox"
                                            className="mt-1 w-5 h-5 text-indigo-600 rounded focus:ring-indigo-500"
                                        />
                                        <div>
                                            <span className="block text-sm font-medium text-gray-900">Customer Data</span>
                                            <span className="block text-xs text-gray-500">Confidential customer information</span>
                                        </div>
                                    </div>
                                </div>

                                <h3 className="text-lg font-medium text-gray-900 mt-8">Impact Assessment</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="block text-sm font-medium text-gray-700">Data Sensitivity</label>
                                        <select
                                            name="data_sensitivity"
                                            value={formData.data_sensitivity}
                                            onChange={handleChange}
                                            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
                                        >
                                            <option value="Public">Public</option>
                                            <option value="Internal">Internal</option>
                                            <option value="Confidential">Confidential</option>
                                            <option value="Restricted">Restricted</option>
                                        </select>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="block text-sm font-medium text-gray-700">Expected User Base</label>
                                        <select
                                            name="expected_user_base"
                                            value={formData.expected_user_base}
                                            onChange={handleChange}
                                            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
                                        >
                                            <option value="Internal Only">Internal Only</option>
                                            <option value="Public">Public</option>
                                            <option value="Partners">Partners</option>
                                        </select>
                                    </div>
                                    <div className="col-span-2 space-y-2">
                                        <label className="block text-sm font-medium text-gray-700">Business Impact</label>
                                        <textarea
                                            name="business_impact"
                                            value={formData.business_impact}
                                            onChange={handleChange}
                                            rows={3}
                                            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
                                            placeholder="What is the business impact if this system fails?"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Step 3: Technical Details */}
                    {currentStep === 3 && (
                        <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
                            <div className="border-b border-gray-100 pb-4">
                                <h2 className="text-2xl font-semibold text-gray-900">Technical Architecture</h2>
                                <p className="text-gray-500 mt-1">Details about the model, hosting, and data flow.</p>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="space-y-2">
                                    <label className="block text-sm font-medium text-gray-700">AI Model Provider</label>
                                    <select
                                        name="ai_model_provider"
                                        value={formData.ai_model_provider}
                                        onChange={handleChange}
                                        className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
                                    >
                                        <option value="OpenAI">OpenAI</option>
                                        <option value="Azure">Azure</option>
                                        <option value="AWS">AWS</option>
                                        <option value="GCP">GCP</option>
                                        <option value="HuggingFace">HuggingFace</option>
                                        <option value="Other">Other</option>
                                    </select>
                                </div>

                                <div className="space-y-2">
                                    <label className="block text-sm font-medium text-gray-700">Vendor Name (if applicable)</label>
                                    <input
                                        name="vendor_name"
                                        value={formData.vendor_name}
                                        onChange={handleChange}
                                        type="text"
                                        className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
                                        placeholder="e.g., OpenAI, Anthropic"
                                    />
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Step 4: Compliance & Governance */}
                    {currentStep === 4 && (
                        <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
                            <div className="border-b border-gray-100 pb-4">
                                <h2 className="text-2xl font-semibold text-gray-900">Review & Submit</h2>
                                <p className="text-gray-500 mt-1">Please review your answers before submitting.</p>
                            </div>

                            <div className="space-y-6">
                                <div className="p-4 bg-indigo-50 rounded-xl border border-indigo-100 flex gap-3">
                                    <Info className="w-6 h-6 text-indigo-600 flex-shrink-0" />
                                    <p className="text-sm text-indigo-900">By submitting this form, you agree to the AI Governance Policy and acknowledge that this system will be subject to review.</p>
                                </div>

                                <div className="bg-gray-50 p-6 rounded-lg space-y-4">
                                    <h3 className="font-medium text-gray-900">Summary</h3>
                                    <dl className="grid grid-cols-1 gap-x-4 gap-y-4 sm:grid-cols-2">
                                        <div className="sm:col-span-1">
                                            <dt className="text-sm font-medium text-gray-500">Project Name</dt>
                                            <dd className="mt-1 text-sm text-gray-900">{formData.title}</dd>
                                        </div>
                                        <div className="sm:col-span-1">
                                            <dt className="text-sm font-medium text-gray-500">Department</dt>
                                            <dd className="mt-1 text-sm text-gray-900">{formData.department}</dd>
                                        </div>
                                        <div className="sm:col-span-1">
                                            <dt className="text-sm font-medium text-gray-500">Data Sensitivity</dt>
                                            <dd className="mt-1 text-sm text-gray-900">{formData.data_sensitivity}</dd>
                                        </div>
                                        <div className="sm:col-span-1">
                                            <dt className="text-sm font-medium text-gray-500">Model Provider</dt>
                                            <dd className="mt-1 text-sm text-gray-900">{formData.ai_model_provider}</dd>
                                        </div>
                                    </dl>
                                </div>
                            </div>
                        </div>
                    )}

                </div>

                {/* Footer Actions */}
                <div className="bg-gray-50 px-8 py-6 border-t border-gray-200 flex justify-between items-center">
                    <button
                        onClick={prevStep}
                        disabled={currentStep === 1}
                        className={cn(
                            "px-6 py-2.5 text-sm font-medium rounded-lg border transition-all flex items-center gap-2",
                            currentStep === 1
                                ? "text-gray-400 border-gray-200 cursor-not-allowed"
                                : "text-gray-700 border-gray-300 bg-white hover:bg-gray-50"
                        )}
                    >
                        <ChevronLeft className="w-4 h-4" />
                        Back
                    </button>

                    <div className="flex gap-3">
                        {currentStep < 4 ? (
                            <button
                                onClick={nextStep}
                                className="px-6 py-2.5 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 shadow-sm transition-all flex items-center gap-2"
                            >
                                Continue
                                <ChevronRight className="w-4 h-4" />
                            </button>
                        ) : (
                            <button
                                onClick={handleSubmit}
                                disabled={loading}
                                className="px-6 py-2.5 text-sm font-medium text-white bg-green-600 rounded-lg hover:bg-green-700 focus:ring-2 focus:ring-offset-2 focus:ring-green-500 shadow-sm transition-all flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {loading ? 'Submitting...' : 'Submit Assessment'}
                                <CheckCircle2 className="w-4 h-4" />
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
