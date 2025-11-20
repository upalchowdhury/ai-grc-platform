import React, { useEffect, useState } from 'react';
import { reviewApi, intakeApi } from '../api/client';

const ReviewerDashboard: React.FC = () => {
    const [tasks, setTasks] = useState<any[]>([]);
    const [selectedTask, setSelectedTask] = useState<any>(null);
    const [requestDetails, setRequestDetails] = useState<any>(null);

    useEffect(() => {
        loadTasks();
    }, []);

    const loadTasks = async () => {
        try {
            const res = await reviewApi.listPending();
            setTasks(res.data);
        } catch (err) {
            console.error(err);
        }
    };

    const handleSelectTask = async (task: any) => {
        setSelectedTask(task);
        try {
            const res = await intakeApi.get(task.request_id);
            setRequestDetails(res.data);
        } catch (err) {
            console.error(err);
        }
    };

    const handleAction = async (status: string) => {
        if (!selectedTask) return;
        try {
            await reviewApi.updateTask(selectedTask.id, { status });
            setSelectedTask(null);
            setRequestDetails(null);
            loadTasks();
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div className="flex h-screen bg-gray-100">
            <div className="w-1/3 bg-white border-r p-4 overflow-y-auto">
                <h2 className="text-xl font-bold mb-4">Pending Reviews</h2>
                <div className="space-y-2">
                    {tasks.map(task => (
                        <div
                            key={task.id}
                            onClick={() => handleSelectTask(task)}
                            className={`p-3 border rounded cursor-pointer hover:bg-gray-50 ${selectedTask?.id === task.id ? 'bg-indigo-50 border-indigo-500' : ''}`}
                        >
                            <p className="font-medium">{task.team} Review</p>
                            <p className="text-sm text-gray-500">{new Date(task.created_at).toLocaleDateString()}</p>
                        </div>
                    ))}
                </div>
            </div>

            <div className="flex-1 p-8">
                {selectedTask && requestDetails ? (
                    <div className="bg-white p-6 rounded shadow">
                        <h2 className="text-2xl font-bold mb-4">{requestDetails.title}</h2>
                        <p className="mb-4 text-gray-700">{requestDetails.description}</p>

                        <div className="border-t pt-4 mt-4">
                            <h3 className="font-bold mb-2">Review Action</h3>
                            <div className="flex space-x-4">
                                <button
                                    onClick={() => handleAction('approved')}
                                    className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                                >
                                    Approve
                                </button>
                                <button
                                    onClick={() => handleAction('rejected')}
                                    className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                                >
                                    Reject
                                </button>
                                <button
                                    onClick={() => handleAction('needs-info')}
                                    className="px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600"
                                >
                                    Request Info
                                </button>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="text-center text-gray-500 mt-20">Select a task to review</div>
                )}
            </div>
        </div>
    );
};

export default ReviewerDashboard;
