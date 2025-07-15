import React from "react";

function TestimonialCard({ fullName, occupation, testimonial, rating }) {
  // Ensure rating is a valid number between 0 and 5
  const validRating = typeof rating === 'number' && !isNaN(rating) 
    ? Math.max(0, Math.min(5, rating)) 
    : 0;

  const stars = Array.from({ length: 5 }, (_, index) => {
    return index < validRating ? "⭐" : "☆";
  });

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 h-full">
      <div className="flex items-center mb-4">
        <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mr-4">
          <span className="text-blue-600 font-bold text-xl">
            {fullName ? fullName.charAt(0).toUpperCase() : "?"}
          </span>
        </div>
        <div>
          <h3 className="font-semibold text-lg ">{fullName || "Anonymous"}</h3>
          <h3 className="text-sm ">{occupation}</h3>
          <div className="flex">
            {stars.map((star, index) => (
              <span key={index} className="text-yellow-400">
                {star}
              </span>
            ))}
          </div>
        </div>
      </div>
      <p className="text-gray-700">{testimonial || "No testimonial provided."}</p>
    </div>
  );
}

export default TestimonialCard;