import React, { useState } from 'react';
import { intakeApi, aiApi } from '../api/client';
import { useNavigate } from 'react-router-dom';

const IntakeForm: React.FC = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        // Project Details
        title: '',
        description: '',
        owner: '',
        department: '',
        expected_launch_date: '',
        project_status: 'planning',

        // Data Privacy
        has_pii: false,
        has_phi: false,
        data_classification: 'public',
        data_volume: 'low',
        data_retention_period: '',
        data_source_internal: false,
        data_source_external: false,
        data_residency: 'us',

        // Security & Compliance
        requires_authentication: true,
        encryption_at_rest: true,
        encryption_in_transit: true,
        public_access: false,
        vendor_risk_assessment_done: false,
        incident_response_plan: false,
        access_control_mechanism: '',

        // Vendor Information
        vendor_name: '',
        vendor_contact: '',
        contract_status: 'none',
        sla_defined: false,
        vendor_security_certifications: '',

        // Technical Details
        model_type: 'llm',
        hosting_environment: 'cloud',
        api_usage_expected: false,
        rate_limits_required: false,
        estimated_latency: '',
        integration_complexity: 'low',

        // AI Specifics
        training_data_used: false,
        human_in_the_loop: false,
        automated_decision_making: false,
        bias_mitigation_plan: '',

        requestor_id: '00000000-0000-0000-0000-000000000000', // Mock ID
    });

    const [aiSuggestions, setAiSuggestions] = useState<string[]>([]);
    const [activeSection, setActiveSection] = useState('project');

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;
        const checked = (e.target as HTMLInputElement).checked;

        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleCheckMissing = async () => {
        const fields = Object.keys(formData).filter(k => formData[k as keyof typeof formData]);
        try {
            const res = await aiApi.checkMissing(fields);
            setAiSuggestions(res.data.suggestions);
        } catch (err) {
            console.error(err);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        console.log('Submitting form...', formData);
        try {
            const res = await intakeApi.create(formData);
            console.log('Submission success:', res);
            navigate('/reviews');
        } catch (err) {
            console.error('Submission error:', err);
            alert('Submission failed! Check console.');
        }
    };

    const sections = [
        { id: 'project', title: 'Project Details', icon: '📋' },
        { id: 'privacy', title: 'Data Privacy', icon: '🔒' },
        { id: 'security', title: 'Security & Compliance', icon: '🛡️' },
        { id: 'vendor', title: 'Vendor Information', icon: '🏢' },
        { id: 'technical', title: 'Technical Details', icon: '⚙️' },
        { id: 'ai', title: 'AI Specifics', icon: '🤖' },
    ];

    return (
        <div className="max-w-5xl mx-auto">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900">New AI Intake Request</h1>
                <p className="mt-2 text-gray-600">Complete this form to initiate the governance review process for your AI project.</p>
            </div>

            <div className="flex gap-8">
                {/* Form Navigation */}
                <div className="w-64 flex-shrink-0">
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden sticky top-8">
                        {sections.map((section) => (
                            <button
                                key={section.id}
                                onClick={() => setActiveSection(section.id)}
                                className={`w-full flex items-center px-4 py-3 text-left text-sm font-medium transition-colors ${activeSection === section.id
                                    ? 'bg-indigo-50 text-indigo-700 border-l-4 border-indigo-600'
                                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900 border-l-4 border-transparent'
                                    }`}
                            >
                                <span className="mr-3">{section.icon}</span>
                                {section.title}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Form Content */}
                <div className="flex-1">
                    <form onSubmit={handleSubmit} className="space-y-6">

                        {/* Project Details */}
                        <div className={`bg-white rounded-xl shadow-sm border border-gray-100 p-6 ${activeSection === 'project' ? 'block' : 'hidden'}`}>
                            <h2 className="text-xl font-semibold mb-6 flex items-center text-gray-800">
                                <span className="mr-2">📋</span> Project Details
                            </h2>
                            <div className="grid grid-cols-1 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Project Title</label>
                                    <input type="text" name="title" value={formData.title} onChange={handleChange} className="w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-2.5 border" placeholder="e.g., Customer Support Bot" required />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                                    <textarea name="description" value={formData.description} onChange={handleChange} rows={4} className="w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-2.5 border" placeholder="Describe the purpose and functionality..." required />
                                </div>
                                <div className="grid grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Project Owner</label>
                                        <input type="text" name="owner" value={formData.owner} onChange={handleChange} className="w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-2.5 border" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Department</label>
                                        <select name="department" value={formData.department} onChange={handleChange} className="w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-2.5 border">
                                            <option value="">Select Department</option>
                                            <option value="engineering">Engineering</option>
                                            <option value="product">Product</option>
                                            <option value="marketing">Marketing</option>
                                            <option value="hr">HR</option>
                                            <option value="sales">Sales</option>
                                        </select>
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Expected Launch Date</label>
                                        <input type="date" name="expected_launch_date" value={formData.expected_launch_date} onChange={handleChange} className="w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-2.5 border" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Project Status</label>
                                        <select name="project_status" value={formData.project_status} onChange={handleChange} className="w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-2.5 border">
                                            <option value="planning">Planning</option>
                                            <option value="development">Development</option>
                                            <option value="testing">Testing</option>
                                        </select>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Data Privacy */}
                        <div className={`bg-white rounded-xl shadow-sm border border-gray-100 p-6 ${activeSection === 'privacy' ? 'block' : 'hidden'}`}>
                            <h2 className="text-xl font-semibold mb-6 flex items-center text-gray-800">
                                <span className="mr-2">🔒</span> Data Privacy
                            </h2>
                            <div className="space-y-6">
                                <div className="flex items-center space-x-8 p-4 bg-gray-50 rounded-lg">
                                    <label className="flex items-center space-x-3 cursor-pointer">
                                        <input type="checkbox" name="has_pii" checked={formData.has_pii} onChange={handleChange} className="h-5 w-5 text-indigo-600 rounded focus:ring-indigo-500 border-gray-300" />
                                        <span className="text-gray-700 font-medium">Contains PII</span>
                                    </label>
                                    <label className="flex items-center space-x-3 cursor-pointer">
                                        <input type="checkbox" name="has_phi" checked={formData.has_phi} onChange={handleChange} className="h-5 w-5 text-indigo-600 rounded focus:ring-indigo-500 border-gray-300" />
                                        <span className="text-gray-700 font-medium">Contains PHI</span>
                                    </label>
                                </div>

                                <div className="grid grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Data Classification</label>
                                        <select name="data_classification" value={formData.data_classification} onChange={handleChange} className="w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-2.5 border">
                                            <option value="public">Public</option>
                                            <option value="internal">Internal</option>
                                            <option value="confidential">Confidential</option>
                                            <option value="restricted">Restricted</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Data Volume</label>
                                        <select name="data_volume" value={formData.data_volume} onChange={handleChange} className="w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-2.5 border">
                                            <option value="low">Low (&lt; 1GB)</option>
                                            <option value="medium">Medium (1GB - 1TB)</option>
                                            <option value="high">High (&gt; 1TB)</option>
                                        </select>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Data Retention Period</label>
                                    <input type="text" name="data_retention_period" value={formData.data_retention_period} onChange={handleChange} className="w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-2.5 border" placeholder="e.g., 30 days, 1 year" />
                                </div>

                                <div className="space-y-2">
                                    <label className="block text-sm font-medium text-gray-700">Data Sources</label>
                                    <div className="flex space-x-6">
                                        <label className="flex items-center space-x-2">
                                            <input type="checkbox" name="data_source_internal" checked={formData.data_source_internal} onChange={handleChange} className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500" />
                                            <span className="text-gray-600">Internal Databases</span>
                                        </label>
                                        <label className="flex items-center space-x-2">
                                            <input type="checkbox" name="data_source_external" checked={formData.data_source_external} onChange={handleChange} className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500" />
                                            <span className="text-gray-600">External APIs/Vendors</span>
                                        </label>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Security & Compliance */}
                        <div className={`bg-white rounded-xl shadow-sm border border-gray-100 p-6 ${activeSection === 'security' ? 'block' : 'hidden'}`}>
                            <h2 className="text-xl font-semibold mb-6 flex items-center text-gray-800">
                                <span className="mr-2">🛡️</span> Security & Compliance
                            </h2>
                            <div className="grid grid-cols-2 gap-6">
                                <div className="space-y-4">
                                    <label className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50">
                                        <span className="text-gray-700">Requires Authentication</span>
                                        <input type="checkbox" name="requires_authentication" checked={formData.requires_authentication} onChange={handleChange} className="h-5 w-5 text-indigo-600 rounded focus:ring-indigo-500 border-gray-300" />
                                    </label>
                                    <label className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50">
                                        <span className="text-gray-700">Encryption at Rest</span>
                                        <input type="checkbox" name="encryption_at_rest" checked={formData.encryption_at_rest} onChange={handleChange} className="h-5 w-5 text-indigo-600 rounded focus:ring-indigo-500 border-gray-300" />
                                    </label>
                                    <label className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50">
                                        <span className="text-gray-700">Encryption in Transit</span>
                                        <input type="checkbox" name="encryption_in_transit" checked={formData.encryption_in_transit} onChange={handleChange} className="h-5 w-5 text-indigo-600 rounded focus:ring-indigo-500 border-gray-300" />
                                    </label>
                                </div>
                                <div className="space-y-4">
                                    <label className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50">
                                        <span className="text-gray-700">Publicly Accessible</span>
                                        <input type="checkbox" name="public_access" checked={formData.public_access} onChange={handleChange} className="h-5 w-5 text-indigo-600 rounded focus:ring-indigo-500 border-gray-300" />
                                    </label>
                                    <label className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50">
                                        <span className="text-gray-700">Vendor Risk Assessment</span>
                                        <input type="checkbox" name="vendor_risk_assessment_done" checked={formData.vendor_risk_assessment_done} onChange={handleChange} className="h-5 w-5 text-indigo-600 rounded focus:ring-indigo-500 border-gray-300" />
                                    </label>
                                    <label className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50">
                                        <span className="text-gray-700">Incident Response Plan</span>
                                        <input type="checkbox" name="incident_response_plan" checked={formData.incident_response_plan} onChange={handleChange} className="h-5 w-5 text-indigo-600 rounded focus:ring-indigo-500 border-gray-300" />
                                    </label>
                                </div>
                            </div>
                            <div className="mt-6">
                                <label className="block text-sm font-medium text-gray-700 mb-1">Access Control Mechanism</label>
                                <textarea name="access_control_mechanism" value={formData.access_control_mechanism} onChange={handleChange} rows={2} className="w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-2.5 border" placeholder="Describe how access is managed..." />
                            </div>
                        </div>

                        {/* Vendor Information */}
                        <div className={`bg-white rounded-xl shadow-sm border border-gray-100 p-6 ${activeSection === 'vendor' ? 'block' : 'hidden'}`}>
                            <h2 className="text-xl font-semibold mb-6 flex items-center text-gray-800">
                                <span className="mr-2">🏢</span> Vendor Information
                            </h2>
                            <div className="grid grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Vendor Name</label>
                                    <input type="text" name="vendor_name" value={formData.vendor_name} onChange={handleChange} className="w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-2.5 border" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Vendor Contact</label>
                                    <input type="text" name="vendor_contact" value={formData.vendor_contact} onChange={handleChange} className="w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-2.5 border" />
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-6 mt-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Contract Status</label>
                                    <select name="contract_status" value={formData.contract_status} onChange={handleChange} className="w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-2.5 border">
                                        <option value="none">No Contract</option>
                                        <option value="negotiating">Negotiating</option>
                                        <option value="signed">Signed</option>
                                        <option value="renewing">Renewing</option>
                                    </select>
                                </div>
                                <div className="flex items-center pt-6">
                                    <label className="flex items-center space-x-3 cursor-pointer">
                                        <input type="checkbox" name="sla_defined" checked={formData.sla_defined} onChange={handleChange} className="h-5 w-5 text-indigo-600 rounded focus:ring-indigo-500 border-gray-300" />
                                        <span className="text-gray-700 font-medium">SLA Defined</span>
                                    </label>
                                </div>
                            </div>
                            <div className="mt-6">
                                <label className="block text-sm font-medium text-gray-700 mb-1">Security Certifications</label>
                                <input type="text" name="vendor_security_certifications" value={formData.vendor_security_certifications} onChange={handleChange} className="w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-2.5 border" placeholder="e.g., SOC2, ISO 27001" />
                            </div>
                        </div>

                        {/* Technical Details */}
                        <div className={`bg-white rounded-xl shadow-sm border border-gray-100 p-6 ${activeSection === 'technical' ? 'block' : 'hidden'}`}>
                            <h2 className="text-xl font-semibold mb-6 flex items-center text-gray-800">
                                <span className="mr-2">⚙️</span> Technical Details
                            </h2>
                            <div className="grid grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Model Type</label>
                                    <select name="model_type" value={formData.model_type} onChange={handleChange} className="w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-2.5 border">
                                        <option value="llm">LLM (Large Language Model)</option>
                                        <option value="cv">Computer Vision</option>
                                        <option value="predictive">Predictive Analytics</option>
                                        <option value="other">Other</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Hosting Environment</label>
                                    <select name="hosting_environment" value={formData.hosting_environment} onChange={handleChange} className="w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-2.5 border">
                                        <option value="cloud">Cloud (AWS/GCP/Azure)</option>
                                        <option value="onprem">On-Premise</option>
                                        <option value="hybrid">Hybrid</option>
                                        <option value="saas">SaaS</option>
                                    </select>
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-6 mt-6">
                                <div className="space-y-4">
                                    <label className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50">
                                        <span className="text-gray-700">API Usage Expected</span>
                                        <input type="checkbox" name="api_usage_expected" checked={formData.api_usage_expected} onChange={handleChange} className="h-5 w-5 text-indigo-600 rounded focus:ring-indigo-500 border-gray-300" />
                                    </label>
                                    <label className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50">
                                        <span className="text-gray-700">Rate Limits Required</span>
                                        <input type="checkbox" name="rate_limits_required" checked={formData.rate_limits_required} onChange={handleChange} className="h-5 w-5 text-indigo-600 rounded focus:ring-indigo-500 border-gray-300" />
                                    </label>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Integration Complexity</label>
                                    <select name="integration_complexity" value={formData.integration_complexity} onChange={handleChange} className="w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-2.5 border">
                                        <option value="low">Low (Standalone)</option>
                                        <option value="medium">Medium (Few Integrations)</option>
                                        <option value="high">High (Deep Integration)</option>
                                    </select>
                                    <div className="mt-4">
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Estimated Latency (ms)</label>
                                        <input type="number" name="estimated_latency" value={formData.estimated_latency} onChange={handleChange} className="w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-2.5 border" />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* AI Specifics */}
                        <div className={`bg-white rounded-xl shadow-sm border border-gray-100 p-6 ${activeSection === 'ai' ? 'block' : 'hidden'}`}>
                            <h2 className="text-xl font-semibold mb-6 flex items-center text-gray-800">
                                <span className="mr-2">🤖</span> AI Specifics
                            </h2>
                            <div className="space-y-4 mb-6">
                                <label className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50">
                                    <span className="text-gray-700">Training Data Used</span>
                                    <input type="checkbox" name="training_data_used" checked={formData.training_data_used} onChange={handleChange} className="h-5 w-5 text-indigo-600 rounded focus:ring-indigo-500 border-gray-300" />
                                </label>
                                <label className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50">
                                    <span className="text-gray-700">Human in the Loop</span>
                                    <input type="checkbox" name="human_in_the_loop" checked={formData.human_in_the_loop} onChange={handleChange} className="h-5 w-5 text-indigo-600 rounded focus:ring-indigo-500 border-gray-300" />
                                </label>
                                <label className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50">
                                    <span className="text-gray-700">Automated Decision Making</span>
                                    <input type="checkbox" name="automated_decision_making" checked={formData.automated_decision_making} onChange={handleChange} className="h-5 w-5 text-indigo-600 rounded focus:ring-indigo-500 border-gray-300" />
                                </label>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Bias Mitigation Plan</label>
                                <textarea name="bias_mitigation_plan" value={formData.bias_mitigation_plan} onChange={handleChange} rows={3} className="w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-2.5 border" placeholder="Describe steps to mitigate bias..." />
                            </div>
                        </div>

                        {/* Footer Actions */}
                        <div className="flex items-center justify-between pt-6 border-t">
                            <button
                                type="button"
                                onClick={handleCheckMissing}
                                className="px-6 py-2.5 bg-yellow-50 text-yellow-700 font-medium rounded-lg hover:bg-yellow-100 transition-colors flex items-center"
                            >
                                <span className="mr-2">✨</span> AI Check
                            </button>

                            <div className="flex space-x-4">
                                <button type="button" className="px-6 py-2.5 text-gray-700 font-medium hover:bg-gray-100 rounded-lg transition-colors">
                                    Save Draft
                                </button>
                                <button
                                    type="submit"
                                    className="px-8 py-2.5 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 shadow-sm hover:shadow transition-all"
                                >
                                    Submit Request
                                </button>
                            </div>
                        </div>

                        {aiSuggestions.length > 0 && (
                            <div className="mt-6 p-4 bg-yellow-50 rounded-xl border border-yellow-100 animate-fade-in">
                                <h3 className="font-bold text-yellow-800 mb-2 flex items-center">
                                    <span className="mr-2">💡</span> AI Suggestions
                                </h3>
                                <ul className="list-disc pl-5 text-yellow-700 space-y-1">
                                    {aiSuggestions.map((s, i) => <li key={i}>{s}</li>)}
                                </ul>
                            </div>
                        )}

                    </form>
                </div>
            </div>
        </div>
    );
};

export default IntakeForm;
