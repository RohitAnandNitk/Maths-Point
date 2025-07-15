import React from 'react'

function CreateTestForm() {
    return (
        <div>
            <div>
                <div className='flex justify-between m-2'>
                    <p className='font-bold text-2xl'>Question number 1</p>
                    <p>duration: 2 minutes</p>

                </div>
                <div className="question_text">
                    <label htmlFor="question">Question Text</label>
                    <textarea
                        id="question"
                        placeholder="Enter question..."
                        cols="20"
                        rows="4"
                        className='w-full'
                    />
                </div>

            </div>
        </div>
    )
}

export default CreateTestForm