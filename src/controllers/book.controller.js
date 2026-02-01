import cloudinary from "../lib/cloudinary.js";
import Book from "../models/Book.model.js";
import User from "../models/User.model.js";

export const createbook = async (req, res) => {
    try {
        const { title, caption, image, rating } = req.body;

        if (!title || !caption || !rating || !image) {
            return res.status(400).json({ message: "All fields are required" })
        }

        // upload image to cloudinary
        const uplaodRespone = await cloudinary.uploader.upload(image);
        const imageUrl = uplaodRespone.secure_url;

        const book = new Book({
            title,
            caption,
            image: imageUrl,
            rating,
            user: req.user._id
        })

        await book.save();

        return res.status(201).json({
            book: {
                title: book.title,
                caption: book.caption,
                image: book.image,
                rating: book.rating,
                user: book.user
            }
        })
    } catch (error) {
        console.error("Book creation error: ", error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
}


// pagination => infinite scrolling
export const getBooks = async (req, res) => {
    // example call from react-native / frontend
    // const response = await fetch("http://localhost:3000/api/books?page=1&limit=5");
    try {
        const page = req.query.page || 1;
        const limit = req.query.limit || 5;
        const skip = (page - 1) * 5;

        const books = await Book.find()
            .sort({ createdAt: -1 }) // desc
            .skip(skip)
            .limit(limit)
            .populate("user", "username profileImage");

        const totalBooks = await Book.countDocuments()

        res.json({
            books,
            currentPage: page,
            totalBooks,
            totalPage: Math.ceil(totalBooks / limit)
        })
    } catch (error) {
        console.error("Error fetching books: ", error);
        return res.status(500).json({ message: "Internal Server Error" })
        
    }
}

// get recommended books by logged in user 
export const getRecommendedBooks = async (req, res) => {
    try {
        const books = Book.find({ user: req.user.__id }).sort({ createdAt: -1 })
        return res.json(books)
    } catch (error) {
        console.error("Error getting recommended books: ", error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
}

export const deleteBook = async (req, res) => {
    try {
        const book = await Book.findById(req.params.id);
        if (!book) {
            return res.status(400).json({ message: "Book not found" });
        }

        // check if user is the creator of the book
        if (book.user.toString() !== req.user._id.toString()) {
            return res.status(401).json({ message: "Unauthorized" });
        }

        // delete book image from cloudinary
        // sample cloudinary image url: https://res.cloudinary.com/dkjxsipsx/image/upload/v1764498260/image_vvbrtm.png
        if (book.image && book.image.includes("cloudinary")) {
            try {
                const publicId = book.image.split("/").pop().split(".")[0];
                await cloudinary.uploader.destroy(publicId)
            } catch (cloudinaryError) {
                console.error("Error deleting book image: ", cloudinaryError);
            }

        await book.deleteOne();
        }
    } catch (error) {
        console.error("Error deleting book: ", error);
        return res.status(500).json({ message: "Internal Server Error" })
    }
}