import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { SessionForm, SessionFormData } from '../../components/sessions/SessionForm';
import { Card } from '../../components/ui/Card';
import { ArrowLeftIcon } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { toast } from 'sonner';
import { sessionApi } from '../../services/sessionApi';

export const SessionCreate = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [createZoom, setCreateZoom] = useState(true);

  // Check if user is instructor or admin
  const isInstructor = user?.role === 'instructor' || user?.role === 'admin';

  if (!isInstructor) {
    return (
      <div className="py-6">
        <Card className="p-6">
          <div className="text-center">
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Access Denied</h2>
            <p className="text-gray-600 mb-4">Only instructors can create sessions.</p>
            <Button variant="primary" onClick={() => navigate('/dashboard/sessions')}>
              Go to Sessions
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  const handleSubmit = async (data: SessionFormData) => {
    setIsLoading(true);
    try {
      const created = await sessionApi.create({
        title: data.title,
        course: data.course,
        courseCode: data.courseCode,
        date: data.date,
        startTime: data.startTime,
        endTime: data.endTime,
        duration: data.duration,
        description: data.description,
        materials: data.materials || [],
        type: 'scheduled',
        expectedParticipants: undefined,
        createZoom,
      }, { role: (user?.role as any) || 'instructor' });

      console.log('Session created:', created);
      toast.success('Session created successfully!');
      navigate('/dashboard/sessions');
    } catch (error) {
      console.error('Error creating session:', error);
      toast.error('Failed to create session. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="py-6">
      <div className="mb-6">
        <Button
          variant="outline"
          leftIcon={<ArrowLeftIcon className="h-4 w-4" />}
          onClick={() => navigate('/dashboard/sessions')}
          className="mb-4"
        >
          Back to Sessions
        </Button>
        <h1 className="text-2xl font-semibold text-gray-900">Create New Session</h1>
        <p className="mt-1 text-sm text-gray-500">
          Fill in the details below to create a new learning session
        </p>
      </div>

      <SessionForm
        onSubmit={handleSubmit}
        onCancel={() => navigate('/dashboard/sessions')}
        isLoading={isLoading}
      />
      <div className="mt-4">
        <label className="inline-flex items-center space-x-2">
          <input
            type="checkbox"
            checked={createZoom}
            onChange={(e) => setCreateZoom(e.target.checked)}
          />
          <span className="text-sm text-gray-700">Create Zoom meeting for this session</span>
        </label>
      </div>
    </div>
  );
};

