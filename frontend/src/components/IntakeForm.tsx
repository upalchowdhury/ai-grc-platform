import { useState } from 'react';
import { Info, CheckCircle2, ChevronRight, ChevronLeft, Save } from 'lucide-react';
import { cn } from '../lib/utils';

export function IntakeForm() {
    const [currentStep, setCurrentStep] = useState(1);

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
                                    <input type="text" className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all" placeholder="e.g., Customer Service Chatbot" />
                                </div>

                                <div className="col-span-2 space-y-2">
                                    <label className="block text-sm font-medium text-gray-700">Description *</label>
                                    <textarea rows={4} className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all" placeholder="Describe the purpose and functionality..." />
                                </div>

                                <div className="space-y-2">
                                    <label className="block text-sm font-medium text-gray-700">Business Unit *</label>
                                    <select className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all">
                                        <option>Select Unit...</option>
                                        <option>Engineering</option>
                                        <option>Product</option>
                                        <option>Marketing</option>
                                        <option>HR</option>
                                        <option>Finance</option>
                                        <option>Legal</option>
                                    </select>
                                </div>

                                <div className="space-y-2">
                                    <label className="block text-sm font-medium text-gray-700">Project Owner *</label>
                                    <input type="text" className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all" placeholder="email@company.com" />
                                </div>

                                <div className="space-y-2">
                                    <label className="block text-sm font-medium text-gray-700">Executive Sponsor</label>
                                    <input type="text" className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all" placeholder="VP or C-Level Sponsor" />
                                </div>

                                <div className="space-y-2">
                                    <label className="block text-sm font-medium text-gray-700">Expected Launch Date</label>
                                    <input type="date" className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all" />
                                </div>

                                <div className="col-span-2 space-y-2">
                                    <label className="block text-sm font-medium text-gray-700">Problem Statement</label>
                                    <textarea rows={3} className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all" placeholder="What business problem does this solve?" />
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
                                    {[
                                        { label: 'PII (Personally Identifiable Info)', desc: 'Names, emails, phones' },
                                        { label: 'PHI (Protected Health Info)', desc: 'Medical records, biometrics' },
                                        { label: 'PCI (Payment Card Info)', desc: 'Credit cards, bank accounts' },
                                        { label: 'Intellectual Property', desc: 'Trade secrets, code, patents' },
                                        { label: 'Public Data', desc: 'Wiki articles, press releases' },
                                        { label: 'Internal Non-Sensitive', desc: 'Internal memos, schedules' }
                                    ].map((item, i) => (
                                        <div key={i} className="flex items-start gap-3 p-4 border border-gray-200 rounded-xl hover:border-indigo-500 hover:bg-indigo-50/30 cursor-pointer transition-all">
                                            <input type="checkbox" className="mt-1 w-5 h-5 text-indigo-600 rounded focus:ring-indigo-500" />
                                            <div>
                                                <span className="block text-sm font-medium text-gray-900">{item.label}</span>
                                                <span className="block text-xs text-gray-500">{item.desc}</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                <h3 className="text-lg font-medium text-gray-900 mt-8">Impact Assessment</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="block text-sm font-medium text-gray-700">Number of Users Impacted</label>
                                        <select className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all">
                                            <option>&lt; 100</option>
                                            <option>100 - 1,000</option>
                                            <option>1,000 - 10,000</option>
                                            <option>10,000+</option>
                                        </select>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="block text-sm font-medium text-gray-700">Decision Autonomy</label>
                                        <select className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all">
                                            <option>Human in the loop (Recommendation only)</option>
                                            <option>Human over the loop (Supervisor review)</option>
                                            <option>Fully Automated (No human intervention)</option>
                                        </select>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="block text-sm font-medium text-gray-700">External Facing?</label>
                                        <select className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all">
                                            <option>Internal Only</option>
                                            <option>External (Customers/Partners)</option>
                                            <option>Public (Open Internet)</option>
                                        </select>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="block text-sm font-medium text-gray-700">Financial Impact Potential</label>
                                        <select className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all">
                                            <option>Low (&lt; $10k)</option>
                                            <option>Medium ($10k - $100k)</option>
                                            <option>High ($100k - $1M)</option>
                                            <option>Critical (&gt; $1M)</option>
                                        </select>
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
                                    <label className="block text-sm font-medium text-gray-700">Model Type</label>
                                    <select className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all">
                                        <option>LLM (GPT-4, Claude, etc.)</option>
                                        <option>Computer Vision</option>
                                        <option>Predictive Analytics / Regression</option>
                                        <option>Recommendation Engine</option>
                                        <option>Other</option>
                                    </select>
                                </div>

                                <div className="space-y-2">
                                    <label className="block text-sm font-medium text-gray-700">Hosting Environment</label>
                                    <select className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all">
                                        <option>On-Premise</option>
                                        <option>Private Cloud (AWS/Azure/GCP)</option>
                                        <option>SaaS / 3rd Party API</option>
                                        <option>Hybrid</option>
                                    </select>
                                </div>

                                <div className="space-y-2">
                                    <label className="block text-sm font-medium text-gray-700">Vendor / Foundation Model</label>
                                    <input type="text" className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all" placeholder="e.g., OpenAI, Anthropic, HuggingFace" />
                                </div>

                                <div className="space-y-2">
                                    <label className="block text-sm font-medium text-gray-700">Training Data Source</label>
                                    <input type="text" className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all" placeholder="e.g., Internal DB, Public Web, Purchased" />
                                </div>

                                <div className="col-span-2 space-y-4">
                                    <label className="block text-sm font-medium text-gray-700">Integrations</label>
                                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                                        {['Slack', 'Email', 'CRM (Salesforce)', 'HRIS (Workday)', 'Code Repo (GitHub)', 'Jira'].map(tool => (
                                            <label key={tool} className="flex items-center gap-2 p-3 border rounded-lg hover:bg-gray-50 cursor-pointer">
                                                <input type="checkbox" className="rounded text-indigo-600" />
                                                <span className="text-sm">{tool}</span>
                                            </label>
                                        ))}
                                    </div>
                                </div>

                                <div className="col-span-2 space-y-2">
                                    <label className="block text-sm font-medium text-gray-700">System Architecture Diagram URL</label>
                                    <input type="url" className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all" placeholder="https://confluence..." />
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Step 4: Compliance & Governance */}
                    {currentStep === 4 && (
                        <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
                            <div className="border-b border-gray-100 pb-4">
                                <h2 className="text-2xl font-semibold text-gray-900">Compliance & Governance</h2>
                                <p className="text-gray-500 mt-1">Regulatory requirements and ethical considerations.</p>
                            </div>

                            <div className="space-y-6">
                                <div className="p-4 bg-indigo-50 rounded-xl border border-indigo-100 flex gap-3">
                                    <Info className="w-6 h-6 text-indigo-600 flex-shrink-0" />
                                    <p className="text-sm text-indigo-900">Based on your previous answers, the following compliance checks are recommended.</p>
                                </div>

                                <div className="space-y-4">
                                    {[
                                        'Does this system make decisions that legally or significantly affect individuals?',
                                        'Is there a mechanism for users to opt-out or contest decisions?',
                                        'Has a bias audit been performed on the training data?',
                                        'Is the output watermarked or disclosed as AI-generated?',
                                        'Do you have a fallback plan if the model fails?',
                                        'Is user consent obtained for data usage?',
                                        'Are data retention policies defined?',
                                        'Does the system comply with GDPR/CCPA right to be forgotten?'
                                    ].map((q, i) => (
                                        <div key={i} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                                            <span className="text-sm font-medium text-gray-800 w-2/3">{q}</span>
                                            <div className="flex gap-4">
                                                <label className="flex items-center gap-2 cursor-pointer">
                                                    <input type="radio" name={`q${i}`} className="text-indigo-600 focus:ring-indigo-500" />
                                                    <span className="text-sm text-gray-600">Yes</span>
                                                </label>
                                                <label className="flex items-center gap-2 cursor-pointer">
                                                    <input type="radio" name={`q${i}`} className="text-indigo-600 focus:ring-indigo-500" />
                                                    <span className="text-sm text-gray-600">No</span>
                                                </label>
                                                <label className="flex items-center gap-2 cursor-pointer">
                                                    <input type="radio" name={`q${i}`} className="text-indigo-600 focus:ring-indigo-500" />
                                                    <span className="text-sm text-gray-600">N/A</span>
                                                </label>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                <div className="space-y-2 pt-4">
                                    <label className="block text-sm font-medium text-gray-700">Additional Compliance Notes</label>
                                    <textarea rows={3} className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all" placeholder="Any other regulatory considerations..." />
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
                        <button className="px-6 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:ring-2 focus:ring-offset-2 focus:ring-gray-200 transition-all flex items-center gap-2">
                            <Save className="w-4 h-4" />
                            Save Draft
                        </button>

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
                                className="px-6 py-2.5 text-sm font-medium text-white bg-green-600 rounded-lg hover:bg-green-700 focus:ring-2 focus:ring-offset-2 focus:ring-green-500 shadow-sm transition-all flex items-center gap-2"
                            >
                                Submit Assessment
                                <CheckCircle2 className="w-4 h-4" />
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
