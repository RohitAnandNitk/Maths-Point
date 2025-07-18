import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import profile_image from "../assets/avatar.png";
import config from "../config";

const BaseURL = config.BASE_URL;

function Profile() {
  const navigate = useNavigate();
  const [userData, setUserData] = useState(null);
  const [testData, setTestData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10; // 📄 items per page

  const checkAuthStatus = async () => {
    try {
      const response = await fetch(`${BaseURL}/api/user/check-auth`, {
        credentials: "include",
      });
      const data = await response.json();
      return data.user;
    } catch (error) {
      console.error("Auth check failed:", error);
      return null;
    }
  };

  useEffect(() => {
    const fetchUser = async () => {
      const userInfo = await checkAuthStatus();
      setUserData(userInfo);
    };

    fetchUser();
  }, []);

  useEffect(() => {
    const fetchResults = async () => {
      try {
        const res = await fetch(`${BaseURL}/attempt/get-all-attempts`, {
          credentials: "include",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        if (!res.ok) throw new Error("Failed to fetch attempts");

        const data = await res.json();
        setTestData(data.attempts || []);
      } catch (err) {
        console.error("Error fetching results:", err);
      }
    };

    fetchResults();
  }, []);

  const handleEditProfile = () => navigate("/edit");

  const calculateAverageScore = () => {
    if (!testData.length) return 0;
    const total = testData.reduce(
      (sum, attempt) => sum + (attempt.score || 0),
      0
    );
    return Math.round(total / testData.length);
  };

  const totalPages = Math.ceil(testData.length / pageSize);

  const paginatedData = testData.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const handlePrev = () => setCurrentPage((prev) => Math.max(prev - 1, 1));
  const handleNext = () =>
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="container mx-auto max-w-4xl">
        <div className="bg-white shadow-md rounded-lg p-6">
          {/* Profile Header */}
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center space-x-4">
              <div className="w-20 h-20">
                <img
                  src={profile_image}
                  alt="Profile"
                  className="w-full h-full rounded-full object-cover"
                />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-800">
                  {userData?.fullname || "Loading..."}
                </h1>
                <p className="text-gray-600">{userData?.email}</p>
                <p className="text-gray-500 text-sm">{userData?.role}</p>
              </div>
            </div>
            <button
              onClick={handleEditProfile}
              className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
            >
              Edit Profile
            </button>
          </div>

          {/* Profile Stats */}
          <div className="grid grid-cols-3 gap-4 mb-6 text-center">
            <div>
              <p className="text-gray-600">Tests Taken</p>
              <p className="text-2xl font-bold text-gray-800">
                {testData.length}
              </p>
            </div>
            <div>
              <p className="text-gray-600">Average Score</p>
              <p className="text-2xl font-bold text-green-600">
                {calculateAverageScore()}%
              </p>
            </div>
            <div>
              <p className="text-gray-600">Active Plans</p>
              <p className="text-2xl font-bold text-gray-800">
                {userData?.activePlan?.length || 0}
              </p>
            </div>
          </div>

          {/* Test History */}
          <div>
            <h2 className="text-lg font-semibold mb-4 text-gray-800">
              Test History
            </h2>
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
                {paginatedData.length === 0 ? (
                  <tr>
                    <td colSpan="4" className="p-4 text-center text-gray-500">
                      No test history available.
                    </td>
                  </tr>
                ) : (
                  paginatedData.map((attempt, index) => (
                    <tr key={index} className="border-b">
                      <td className="p-2">
                        {attempt.test_id?.name || "Untitled Test"}
                      </td>
                      <td className="p-2 text-center text-green-600">
                        {attempt.score ?? "N/A"}
                      </td>
                      <td className="p-2 text-center">
                        {new Date(attempt.createdAt).toLocaleDateString(
                          "en-US",
                          {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                          }
                        )}
                      </td>
                      <td className="p-2 text-right">
                        <button className="text-blue-500 hover:underline">
                          View
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>

            {/* Pagination Controls */}
            {testData.length > pageSize && (
              <div className="flex justify-center mt-4 space-x-2">
                <button
                  onClick={handlePrev}
                  disabled={currentPage === 1}
                  className={`px-3 py-1 rounded ${
                    currentPage === 1
                      ? "bg-gray-300 text-gray-600 cursor-not-allowed"
                      : "bg-blue-500 text-white hover:bg-blue-600"
                  }`}
                >
                  Previous
                </button>
                <span className="px-3 py-1 text-gray-700">
                  Page {currentPage} of {totalPages}
                </span>
                <button
                  onClick={handleNext}
                  disabled={currentPage === totalPages}
                  className={`px-3 py-1 rounded ${
                    currentPage === totalPages
                      ? "bg-gray-300 text-gray-600 cursor-not-allowed"
                      : "bg-blue-500 text-white hover:bg-blue-600"
                  }`}
                >
                  Next
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;

{
  /* Achievements */
}
{
  /* <div>
            <h2 className="text-lg font-semibold mb-4 text-gray-800">
              Achievements
            </h2>
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
          </div> */
}

{
  /* Performance Overview */
}
{
  /* <div className="mt-6">
            <h2 className="text-lg font-semibold mb-4 text-gray-800">
              Performance Overview
            </h2>
            <div className="bg-gray-100 rounded-lg p-4 text-center text-gray-500">
              Performance graph will be displayed here
            </div>
          </div> */
}
