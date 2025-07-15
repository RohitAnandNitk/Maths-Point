const Testimonial = require('../Models/testimonial');
const User = require('../Models/user');

async function submitTestimonial(req, res) {
    console.log("Received request body:", req.body); // Debugging log

    const { content, rating, user_id } = req.body;

    try {
        if (!content || !rating || !user_id) {
            console.log("Missing fields:", { content, rating, user_id }); // Log missing fields
            return res.status(400).json({
                success: false,
                message: "Please provide all required fields"
            });
        }

        const testimonial = new Testimonial({
            user_id,
            content,
            rating
        });

        await testimonial.save();
        res.status(201).json({
            success: true,
            message: "Testimonial submitted successfully",
            testimonial
        });

    } catch (error) {
        console.error("Error submitting testimonial:", error);
        res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message
        });
    }
}



async function getTestimonials(req, res) {
    try {
        const testimonials = await Testimonial.find().populate('user_id', 'fullname email');
        res.status(200).json({
            success: true,
            testimonials
        });
    } catch (error) {
        console.error('Error fetching testimonials:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching testimonials',
            error: error.message
        });
    }
}

module.exports = { submitTestimonial, getTestimonials };