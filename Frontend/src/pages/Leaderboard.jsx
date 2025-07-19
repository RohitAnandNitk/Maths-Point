import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { Medal } from "lucide-react";
import config from "../config";

const BaseURL = config.BASE_URL;
const medalColors = ["text-yellow-500", "text-gray-400", "text-orange-500"];
const PAGE_SIZE = 10;

const LeaderboardPage = () => {
  const { examId } = useParams();
  const [leaders, setLeaders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      console.log("Call for the leaderboard data");
      try {
        const response = await fetch(`${BaseURL}/leaderboard/${examId}`);
        const data = await response.json();
        console.log(data.leaderboard);
        setLeaders(data.leaderboard || []);
      } catch (error) {
        console.error("Error fetching leaderboard:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchLeaderboard();
  }, [examId]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <span className="text-xl font-semibold animate-pulse">
          Loading leaderboard...
        </span>
      </div>
    );
  }

  if (leaders.length === 0) {
    return (
      <div className="flex justify-center items-center h-screen">
        <span className="text-xl font-semibold text-gray-500">
          No results yet for this exam.
        </span>
      </div>
    );
  }

  const maxScore = leaders[0]?.score || 1;

  // pagination logic
  const totalPages = Math.ceil(leaders.length / PAGE_SIZE);
  const startIndex = (currentPage - 1) * PAGE_SIZE;
  const currentLeaders = leaders.slice(startIndex, startIndex + PAGE_SIZE);

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-50 to-purple-50 p-4">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-4xl mx-auto bg-white p-6 rounded-xl shadow-md"
      >
        <h1 className="text-3xl font-bold text-center mb-6 text-blue-700 flex items-center justify-center gap-2">
          🏆 Leaderboard
        </h1>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead>
              <tr className="bg-blue-50">
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                  Rank
                </th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                  Name
                </th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                  Score
                </th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                  Time Taken
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-100">
              {currentLeaders.map((leader, index) => {
                const absoluteRank = startIndex + index + 1;
                return (
                  <motion.tr
                    key={leader.userId}
                    initial={{ opacity: 0, x: -50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    whileHover={{ scale: 1.02, backgroundColor: "#f9fafb" }}
                    className="cursor-pointer"
                  >
                    <td className="px-4 py-3 font-bold flex items-center gap-2">
                      {absoluteRank <= 3 ? (
                        <Medal
                          className={`w-5 h-5 ${medalColors[absoluteRank - 1]}`}
                        />
                      ) : (
                        absoluteRank
                      )}
                    </td>
                    <td className="px-4 py-3">{leader.name}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div className="w-24 bg-gray-200 rounded-full overflow-hidden">
                          <div
                            className={`h-2 ${
                              absoluteRank === 1
                                ? "bg-green-500"
                                : "bg-blue-400"
                            }`}
                            style={{
                              width: `${(leader.score / maxScore) * 100}%`,
                            }}
                          ></div>
                        </div>
                        <span className="ml-2">{leader.score}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3">{leader.timeTaken}</td>
                  </motion.tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Pagination Controls */}
        <div className="mt-4 flex justify-center gap-2">
          <button
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((p) => p - 1)}
            className={`px-4 py-1 rounded ${
              currentPage === 1
                ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                : "bg-blue-500 text-white hover:bg-blue-600"
            }`}
          >
            Prev
          </button>
          <span className="px-2 py-1">
            Page {currentPage} of {totalPages}
          </span>
          <button
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage((p) => p + 1)}
            className={`px-4 py-1 rounded ${
              currentPage === totalPages
                ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                : "bg-blue-500 text-white hover:bg-blue-600"
            }`}
          >
            Next
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default LeaderboardPage;
