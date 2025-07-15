import React from 'react';
import { Trophy, CheckCircle, Star } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

function Profile() {
    const navigate = useNavigate();
    const handleEditProfile = ()=>{
        navigate('/edit')
    }
  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="container mx-auto max-w-4xl">
        <div className="bg-white shadow-md rounded-lg p-6">
          {/* Profile Header */}
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center space-x-4">
              <div className="w-20 h-20">
                <img 
                  src="/api/placeholder/80/80" 
                  alt="Profile" 
                  className="w-full h-full rounded-full object-cover"
                />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-800">Sarah Johnson</h1>
                <p className="text-gray-600">sarah.johnson@email.com</p>
                <p className="text-gray-500 text-sm">Student</p>
              </div>
            </div>
            <button onClick={handleEditProfile} className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600">
              Edit Profile
            </button>
          </div>

          {/* Profile Stats */}
          <div className="grid grid-cols-3 gap-4 mb-6 text-center">
            <div>
              <p className="text-gray-600">Tests Taken</p>
              <p className="text-2xl font-bold text-gray-800">24</p>
            </div>
            <div>
              <p className="text-gray-600">Average Score</p>
              <p className="text-2xl font-bold text-green-600">85%</p>
            </div>
            <div>
              <p className="text-gray-600">Active Plans</p>
              <p className="text-2xl font-bold text-gray-800">2</p>
            </div>
          </div>

          {/* Test History */}
          <div className="mb-6">
            <h2 className="text-lg font-semibold mb-4 text-gray-800">Test History</h2>
            <table className="w-full">
              <thead className="bg-gray-100">
                <tr>
                  <th className="p-2 text-left">Test Name</th>
                  <th className="p-2 text-center">Score</th>
                  <th className="p-2 text-center">Date</th>
                  <th className="p-2 text-right">Action</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b">
                  <td className="p-2">Mathematics Final</td>
                  <td className="p-2 text-center text-green-600">92%</td>
                  <td className="p-2 text-center">Mar 15, 2025</td>
                  <td className="p-2 text-right">
                    <button className="text-blue-500 hover:underline">View</button>
                  </td>
                </tr>
                <tr>
                  <td className="p-2">Science Quiz</td>
                  <td className="p-2 text-center text-green-600">88%</td>
                  <td className="p-2 text-center">Mar 10, 2025</td>
                  <td className="p-2 text-right">
                    <button className="text-blue-500 hover:underline">View</button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Achievements */}
          <div>
            <h2 className="text-lg font-semibold mb-4 text-gray-800">Achievements</h2>
            <div className="flex space-x-4">
              <div className="text-center">
                <div className="bg-blue-100 rounded-full p-3 inline-block">
                  <Trophy className="text-blue-500" size={24} />
                </div>
                <p className="mt-2 text-sm text-gray-600">Top Scorer</p>
              </div>
              <div className="text-center">
                <div className="bg-green-100 rounded-full p-3 inline-block">
                  <CheckCircle className="text-green-500" size={24} />
                </div>
                <p className="mt-2 text-sm text-gray-600">Perfect Attendance</p>
              </div>
              <div className="text-center">
                <div className="bg-purple-100 rounded-full p-3 inline-block">
                  <Star className="text-purple-500" size={24} />
                </div>
                <p className="mt-2 text-sm text-gray-600">Excellence</p>
              </div>
            </div>
          </div>

          {/* Performance Overview */}
          <div className="mt-6">
            <h2 className="text-lg font-semibold mb-4 text-gray-800">Performance Overview</h2>
            <div className="bg-gray-100 rounded-lg p-4 text-center text-gray-500">
              Performance graph will be displayed here
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;