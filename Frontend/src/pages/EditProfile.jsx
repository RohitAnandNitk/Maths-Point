import React, { useState } from 'react'

export default function EditProfile() {
    const [formDetail, setFormDetail] = useState({
        firstname: "",
        lastname: "",
        email: "",
        contactno: "",
        grade: "",
        year: "",
        bio: ""
    })

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormDetail(prevState => ({
            ...prevState,
            [name]: value
        }));
    }

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
            <div className="bg-white shadow-md rounded-lg w-full max-w-2xl p-8">
                <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">Edit Profile</h2>
                
                {/* Profile Picture Upload */}
                <div className="flex justify-center mb-6">
                    <div className="relative">
                        <img 
                            src="/api/placeholder/150/150" 
                            alt="Profile" 
                            className="w-36 h-36 rounded-full object-cover border-4 border-gray-200"
                        />
                        <button 
                            className="absolute bottom-0 right-0 bg-blue-500 text-white rounded-full w-10 h-10 flex items-center justify-center"
                        >
                            +
                        </button>
                    </div>
                </div>

                <form className="space-y-6">
                    {/* Name Section */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label 
                                htmlFor="firstname" 
                                className="block text-sm font-medium text-gray-700 mb-2"
                            >
                                First Name
                            </label>
                            <input 
                                type="text"
                                name='firstname'
                                id='firstname'
                                value={formDetail.firstname}
                                onChange={handleChange}
                                className='w-full border-2 border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500'
                                placeholder='First Name'
                            />
                        </div>
                        <div>
                            <label 
                                htmlFor="lastname" 
                                className="block text-sm font-medium text-gray-700 mb-2"
                            >
                                Last Name
                            </label>
                            <input 
                                type="text"
                                name='lastname'
                                id='lastname'
                                value={formDetail.lastname}
                                onChange={handleChange}
                                className='w-full border-2 border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500'
                                placeholder='Last Name'
                            />
                        </div>
                    </div>

                    {/* Email */}
                    <div>
                        <label 
                            htmlFor="email" 
                            className="block text-sm font-medium text-gray-700 mb-2"
                        >
                            Email Address
                        </label>
                        <input 
                            type="email"
                            placeholder='abc@gmail.com'
                            id='email'
                            name='email'
                            value={formDetail.email}
                            onChange={handleChange}
                            className='w-full border-2 border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500'
                        />
                    </div>

                    {/* Contact Number */}
                    <div>
                        <label 
                            htmlFor="contactno" 
                            className="block text-sm font-medium text-gray-700 mb-2"
                        >
                            Contact Number
                        </label>
                        <input 
                            type="text"
                            placeholder='+91xxxxxxxxxx'
                            id='contactno'
                            name='contactno'
                            value={formDetail.contactno}
                            onChange={handleChange}
                            className='w-full border-2 border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500'
                        />
                    </div>

                    {/* Bio */}
                    <div>
                        <label 
                            htmlFor="bio" 
                            className="block text-sm font-medium text-gray-700 mb-2"
                        >
                            Bio
                        </label>
                        <textarea 
                            name="bio" 
                            id="bio"
                            value={formDetail.bio}
                            onChange={handleChange}
                            placeholder="Tell us about yourself"
                            className='w-full border-2 border-gray-300 rounded-lg p-2 h-24 focus:outline-none focus:ring-2 focus:ring-blue-500'
                        />
                    </div>

                    {/* Academic Details */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label 
                                htmlFor="grade" 
                                className="block text-sm font-medium text-gray-700 mb-2"
                            >
                                Grade Level
                            </label>
                            <input 
                                type="text"
                                name='grade'
                                id='grade'
                                value={formDetail.grade}
                                onChange={handleChange}
                                className='w-full border-2 border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500'
                                placeholder='Grade Level'
                            />
                        </div>
                        <div>
                            <label 
                                htmlFor="year" 
                                className="block text-sm font-medium text-gray-700 mb-2"
                            >
                                Academic Year
                            </label>
                            <input 
                                type='text'
                                name='year'
                                id='year'
                                value={formDetail.year}
                                onChange={handleChange}
                                className='w-full border-2 border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500'
                                placeholder='Academic Year'
                            />
                        </div>
                    </div>

                    {/* Submit Button */}
                    <div className="flex justify-center mt-6">
                        <button 
                            type="submit" 
                            className="bg-blue-500 text-white py-2 px-6 rounded-lg hover:bg-blue-600 transition duration-300"
                        >
                            Save Changes
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}