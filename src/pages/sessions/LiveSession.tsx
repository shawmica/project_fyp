import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { MessageSquareIcon, UsersIcon, MicIcon, VideoIcon, ShareIcon, MessageCircleIcon, HandIcon, BarChart2Icon, AlertTriangleIcon, ZapIcon, ThumbsUpIcon, SmileIcon, BrainIcon, Settings2Icon } from 'lucide-react';
import { Card, CardHeader, CardContent } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
export const LiveSession = () => {
  const {
    sessionId
  } = useParams();
  const {
    user
  } = useAuth();
  const [activeTab, setActiveTab] = useState('chat');
  const [message, setMessage] = useState('');
  const [audioEnabled, setAudioEnabled] = useState(true);
  const [videoEnabled, setVideoEnabled] = useState(true);
  const [handRaised, setHandRaised] = useState(false);
  const [showAnalytics, setShowAnalytics] = useState(false);
  const [showAIPanel, setShowAIPanel] = useState(false);
  const [showReactions, setShowReactions] = useState(false);
  // Mock session data
  const session = {
    id: sessionId,
    title: 'Machine Learning: Neural Networks',
    course: 'Machine Learning Fundamentals',
    instructor: 'Dr. Jane Smith',
    date: '2023-10-15',
    time: '14:00-15:30',
    status: 'live',
    participants: 32,
    recording: false
  };
  // Mock chat messages
  const [chatMessages, setChatMessages] = useState([{
    id: 1,
    sender: 'Dr. Jane Smith',
    role: 'instructor',
    message: "Welcome to today's session on Neural Networks!",
    time: '14:01'
  }, {
    id: 2,
    sender: 'Alice Johnson',
    role: 'student',
    message: 'Looking forward to learning about activation functions.',
    time: '14:02'
  }, {
    id: 3,
    sender: 'Bob Williams',
    role: 'student',
    message: 'Will we be covering backpropagation today?',
    time: '14:03'
  }]);
  // Mock engagement clusters
  const engagementClusters = [{
    name: 'Highly Engaged',
    count: 12,
    percentage: 38,
    color: 'bg-green-500'
  }, {
    name: 'Moderately Engaged',
    count: 14,
    percentage: 44,
    color: 'bg-blue-500'
  }, {
    name: 'Passively Engaged',
    count: 4,
    percentage: 12,
    color: 'bg-yellow-500'
  }, {
    name: 'At Risk',
    count: 2,
    percentage: 6,
    color: 'bg-red-500'
  }];
  // Mock AI suggestions
  const aiSuggestions = [{
    id: 1,
    type: 'question',
    content: 'Consider asking about activation functions to engage passive students',
    priority: 'high'
  }, {
    id: 2,
    type: 'poll',
    content: 'Poll: Which neural network architecture is best for image recognition?',
    priority: 'medium'
  }, {
    id: 3,
    type: 'alert',
    content: '2 students appear disengaged for >5 minutes',
    priority: 'high'
  }];
  const handleSendMessage = e => {
    e.preventDefault();
    if (!message.trim()) return;
    const newMessage = {
      id: chatMessages.length + 1,
      sender: `${user?.firstName} ${user?.lastName}`,
      role: user?.role,
      message: message.trim(),
      time: new Date().toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit'
      })
    };
    setChatMessages([...chatMessages, newMessage]);
    setMessage('');
  };
  const sendReaction = reaction => {
    console.log(`Sending reaction: ${reaction}`);
    setShowReactions(false);
  };
  return <div className="h-full flex flex-col">
      <div className="bg-white dark:bg-gray-800 shadow rounded-lg">
        <div className="px-4 py-5 sm:px-6 flex flex-wrap items-center justify-between">
          <div>
            <h1 className="text-lg font-medium text-gray-900 dark:text-gray-100">
              {session.title}
            </h1>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              {session.course} • {session.date} • {session.time}
            </p>
          </div>
          <div className="flex items-center mt-2 sm:mt-0">
            <Badge variant={session.status === 'live' ? 'success' : 'default'} className="mr-2">
              {session.status === 'live' ? 'LIVE' : 'RECORDED'}
            </Badge>
            <div className="text-sm text-gray-500 dark:text-gray-400 flex items-center">
              <UsersIcon className="h-4 w-4 mr-1" /> {session.participants}{' '}
              participants
            </div>
          </div>
        </div>
      </div>
      <div className="flex-1 flex overflow-hidden mt-4">
        {/* Main content area - video */}
        <div className="flex-1 overflow-auto">
          <div className="relative">
            <div className="bg-gray-800 h-96 rounded-lg flex items-center justify-center">
              <div className="text-white text-center">
                <p className="text-lg">Video Stream</p>
                <p className="text-sm text-gray-400">
                  {session.status === 'live' ? 'Live session in progress' : 'Recorded session playback'}
                </p>
              </div>
            </div>
            {/* AI monitoring indicator */}
            <div className="absolute top-4 right-4 flex items-center bg-black bg-opacity-50 rounded-full px-3 py-1 text-xs text-white">
              <BrainIcon className="h-3 w-3 mr-1 text-blue-400" />
              AI monitoring ON
            </div>
            {/* Participant videos */}
            <div className="absolute bottom-4 right-4 flex space-x-2">
              {[1, 2, 3].map(i => <div key={i} className="w-24 h-16 bg-gray-700 rounded overflow-hidden border-2 border-gray-600">
                  <div className="h-full flex items-center justify-center text-xs text-gray-400">
                    User {i}
                  </div>
                </div>)}
            </div>
          </div>
          {/* Controls */}
          <div className="mt-4 flex justify-center space-x-4">
            <button onClick={() => setAudioEnabled(!audioEnabled)} className={`p-3 rounded-full ${audioEnabled ? 'bg-indigo-100 dark:bg-indigo-900 text-indigo-800 dark:text-indigo-200' : 'bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400'}`} aria-label={audioEnabled ? 'Mute audio' : 'Unmute audio'}>
              <MicIcon className="h-5 w-5" />
            </button>
            <button onClick={() => setVideoEnabled(!videoEnabled)} className={`p-3 rounded-full ${videoEnabled ? 'bg-indigo-100 dark:bg-indigo-900 text-indigo-800 dark:text-indigo-200' : 'bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400'}`} aria-label={videoEnabled ? 'Turn off camera' : 'Turn on camera'}>
              <VideoIcon className="h-5 w-5" />
            </button>
            <button onClick={() => setHandRaised(!handRaised)} className={`p-3 rounded-full ${handRaised ? 'bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200' : 'bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400'}`} aria-label={handRaised ? 'Lower hand' : 'Raise hand'}>
              <HandIcon className="h-5 w-5" />
            </button>
            <button onClick={() => setShowReactions(!showReactions)} className="p-3 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400" aria-label="Show reactions">
              <SmileIcon className="h-5 w-5" />
            </button>
            <button className="p-3 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400" aria-label="Share screen">
              <ShareIcon className="h-5 w-5" />
            </button>
          </div>
          {/* Reactions popup */}
          {showReactions && <div className="mt-2 flex justify-center space-x-3">
              <button onClick={() => sendReaction('thumbsup')} className="p-2 bg-gray-100 dark:bg-gray-700 rounded-full hover:bg-gray-200 dark:hover:bg-gray-600">
                <ThumbsUpIcon className="h-5 w-5 text-yellow-500" />
              </button>
              <button onClick={() => sendReaction('clap')} className="p-2 bg-gray-100 dark:bg-gray-700 rounded-full hover:bg-gray-200 dark:hover:bg-gray-600">
                <span className="text-lg">👏</span>
              </button>
              <button onClick={() => sendReaction('smile')} className="p-2 bg-gray-100 dark:bg-gray-700 rounded-full hover:bg-gray-200 dark:hover:bg-gray-600">
                <span className="text-lg">😊</span>
              </button>
              <button onClick={() => sendReaction('confused')} className="p-2 bg-gray-100 dark:bg-gray-700 rounded-full hover:bg-gray-200 dark:hover:bg-gray-600">
                <span className="text-lg">😕</span>
              </button>
              <button onClick={() => sendReaction('heart')} className="p-2 bg-gray-100 dark:bg-gray-700 rounded-full hover:bg-gray-200 dark:hover:bg-gray-600">
                <span className="text-lg">❤️</span>
              </button>
            </div>}
          {/* Session info */}
          <Card className="mt-6">
            <CardHeader>
              <h2 className="text-lg font-medium text-gray-900 dark:text-gray-100">
                About this session
              </h2>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                In this session, we'll explore neural networks, including their
                structure, activation functions, and training methods. We'll
                also discuss practical applications and implementation
                considerations.
              </p>
            </CardContent>
          </Card>
          {/* Instructor-only analytics button */}
          {(user?.role === 'instructor' || user?.role === 'admin') && <div className="mt-4 flex justify-center">
              <Button variant={showAnalytics ? 'primary' : 'outline'} leftIcon={<BarChart2Icon className="h-4 w-4" />} onClick={() => {
            setShowAnalytics(!showAnalytics);
            if (showAnalytics) setShowAIPanel(false);
          }}>
                {showAnalytics ? 'Hide Analytics' : 'Show Analytics'}
              </Button>
              <Button variant={showAIPanel ? 'primary' : 'outline'} leftIcon={<BrainIcon className="h-4 w-4" />} className="ml-2" onClick={() => {
            setShowAIPanel(!showAIPanel);
            if (showAIPanel) setShowAnalytics(false);
          }}>
                {showAIPanel ? 'Hide AI Panel' : 'Show AI Panel'}
              </Button>
            </div>}
          {/* Analytics panel (instructor only) */}
          {showAnalytics && (user?.role === 'instructor' || user?.role === 'admin') && <Card className="mt-4 border-2 border-indigo-100 dark:border-indigo-900">
                <CardHeader className="bg-indigo-50 dark:bg-indigo-900">
                  <div className="flex justify-between items-center">
                    <h3 className="text-md font-medium text-indigo-900 dark:text-indigo-100">
                      Real-time Engagement Analytics
                    </h3>
                    <Badge variant="info">Live</Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="mb-4">
                    <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Engagement Clusters
                    </h4>
                    <div className="space-y-3">
                      {engagementClusters.map(cluster => <div key={cluster.name} className="flex items-center">
                          <span className={`h-3 w-3 rounded-full ${cluster.color} mr-2`}></span>
                          <span className="text-sm text-gray-600 dark:text-gray-400 w-32">
                            {cluster.name}
                          </span>
                          <div className="flex-1 mx-2">
                            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                              <div className={`${cluster.color} h-2 rounded-full`} style={{
                        width: `${cluster.percentage}%`
                      }}></div>
                            </div>
                          </div>
                          <span className="text-sm text-gray-600 dark:text-gray-400">
                            {cluster.count} ({cluster.percentage}%)
                          </span>
                        </div>)}
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4 mt-4">
                    <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded-lg">
                      <div className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        Average Attention Score
                      </div>
                      <div className="mt-1 text-xl font-semibold text-indigo-600 dark:text-indigo-400">
                        78%
                      </div>
                    </div>
                    <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded-lg">
                      <div className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        Questions Asked
                      </div>
                      <div className="mt-1 text-xl font-semibold text-indigo-600 dark:text-indigo-400">
                        8
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>}
          {/* AI Panel (instructor only) */}
          {showAIPanel && (user?.role === 'instructor' || user?.role === 'admin') && <Card className="mt-4 border-2 border-blue-100 dark:border-blue-900">
                <CardHeader className="bg-blue-50 dark:bg-blue-900">
                  <div className="flex justify-between items-center">
                    <h3 className="text-md font-medium text-blue-900 dark:text-blue-100 flex items-center">
                      <BrainIcon className="h-4 w-4 mr-2" />
                      AI Teaching Assistant
                    </h3>
                    <button className="p-1 rounded hover:bg-blue-100 dark:hover:bg-blue-800">
                      <Settings2Icon className="h-4 w-4 text-blue-600 dark:text-blue-300" />
                    </button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {aiSuggestions.map(suggestion => <div key={suggestion.id} className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-3">
                        <div className="flex items-center mb-2">
                          {suggestion.type === 'question' && <MessageCircleIcon className="h-4 w-4 text-green-500 mr-2" />}
                          {suggestion.type === 'poll' && <BarChart2Icon className="h-4 w-4 text-blue-500 mr-2" />}
                          {suggestion.type === 'alert' && <AlertTriangleIcon className="h-4 w-4 text-red-500 mr-2" />}
                          <span className="text-xs font-medium text-gray-700 dark:text-gray-300 capitalize">
                            {suggestion.type}
                          </span>
                          {suggestion.priority === 'high' && <Badge variant="danger" size="sm" className="ml-2">
                              High Priority
                            </Badge>}
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {suggestion.content}
                        </p>
                        <div className="mt-2 flex justify-end space-x-2">
                          <Button size="sm" variant="outline">
                            Dismiss
                          </Button>
                          <Button size="sm" variant="secondary">
                            Apply
                          </Button>
                        </div>
                      </div>)}
                  </div>
                  <div className="mt-4 flex">
                    <input type="text" placeholder="Ask AI for teaching suggestions..." className="flex-1 rounded-l-md border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-blue-500 focus:border-blue-500" />
                    <button className="inline-flex items-center px-3 py-2 border border-transparent rounded-r-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700">
                      <ZapIcon className="h-4 w-4" />
                    </button>
                  </div>
                </CardContent>
              </Card>}
        </div>
        {/* Sidebar - chat/participants */}
        <div className="w-80 ml-4 border border-gray-200 dark:border-gray-700 rounded-lg flex flex-col overflow-hidden">
          <div className="border-b border-gray-200 dark:border-gray-700">
            <nav className="-mb-px flex">
              <button className={`w-1/2 py-4 px-1 text-center border-b-2 text-sm font-medium ${activeTab === 'chat' ? 'border-indigo-500 text-indigo-600 dark:text-indigo-400' : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300 dark:hover:border-gray-600'}`} onClick={() => setActiveTab('chat')}>
                <MessageSquareIcon className="h-5 w-5 inline mr-1" />
                Chat
              </button>
              <button className={`w-1/2 py-4 px-1 text-center border-b-2 text-sm font-medium ${activeTab === 'participants' ? 'border-indigo-500 text-indigo-600 dark:text-indigo-400' : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300 dark:hover:border-gray-600'}`} onClick={() => setActiveTab('participants')}>
                <UsersIcon className="h-5 w-5 inline mr-1" />
                Participants
              </button>
            </nav>
          </div>
          {activeTab === 'chat' ? <div className="flex-1 flex flex-col overflow-hidden bg-white dark:bg-gray-800">
              <div className="flex-1 overflow-y-auto p-4">
                {chatMessages.map(msg => <div key={msg.id} className="mb-4">
                    <div className="flex items-start">
                      <div className="flex-shrink-0">
                        <div className={`h-8 w-8 rounded-full flex items-center justify-center ${msg.role === 'instructor' ? 'bg-indigo-100 dark:bg-indigo-900 text-indigo-800 dark:text-indigo-200' : 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200'}`}>
                          {msg.sender.charAt(0)}
                        </div>
                      </div>
                      <div className="ml-3">
                        <div className="flex items-center">
                          <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                            {msg.sender}
                          </p>
                          {msg.role === 'instructor' && <Badge variant="info" size="sm" className="ml-1">
                              Instructor
                            </Badge>}
                          <span className="ml-2 text-xs text-gray-500 dark:text-gray-400">
                            {msg.time}
                          </span>
                        </div>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          {msg.message}
                        </p>
                      </div>
                    </div>
                  </div>)}
              </div>
              <div className="p-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900">
                <form onSubmit={handleSendMessage} className="flex">
                  <input type="text" value={message} onChange={e => setMessage(e.target.value)} placeholder="Type your message..." className="flex-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 dark:border-gray-700 rounded-md dark:bg-gray-800 dark:text-gray-100" />
                  <Button type="submit" variant="primary" size="sm" className="ml-2">
                    <MessageCircleIcon className="h-4 w-4" />
                  </Button>
                </form>
              </div>
            </div> : <div className="flex-1 overflow-y-auto p-4 bg-white dark:bg-gray-800">
              <div className="mb-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="h-8 w-8 rounded-full bg-indigo-100 dark:bg-indigo-900 text-indigo-800 dark:text-indigo-200 flex items-center justify-center">
                      J
                    </div>
                    <div className="ml-3">
                      <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                        Dr. Jane Smith
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        Instructor
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="mb-4">
                <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">
                  Students ({session.participants - 1})
                </p>
                {Array.from({
              length: 5
            }).map((_, i) => <div key={i} className="mb-3">
                    <div className="flex items-center">
                      <div className="h-8 w-8 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 flex items-center justify-center">
                        {String.fromCharCode(65 + i)}
                      </div>
                      <div className="ml-3">
                        <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                          Student {i + 1}
                        </p>
                      </div>
                    </div>
                  </div>)}
                <div className="mt-2 text-center">
                  <button className="text-sm text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300">
                    View all participants
                  </button>
                </div>
              </div>
            </div>}
        </div>
      </div>
    </div>;
};