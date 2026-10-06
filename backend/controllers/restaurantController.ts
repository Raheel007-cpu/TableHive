import { Request, Response } from "express";
import { Restaurant } from "../models/Restaurant.js";
import { Booking } from "../models/Booking.js";

// Get all restaurants with search and filters
export const getRestaurants = async (req: Request, res: Response): Promise<void> => {
    try {
        const { search, priceRange, rating, location, sort, cuisine } = req.query;

        // Build query Object
        const queryObj: any = { status: "approved" };

        if (search) {
            queryObj.$or = [
                { name: { $regex: search, $options: "i" } },
                { cuisine: { $regex: search, $options: "i" } },
                { location: { $regex: search, $options: "i" } },
            ];
        }

        // Cuisine filter (supports single + multiple)
        if (cuisine) {
            const cuisineList = Array.isArray(cuisine) ? cuisine : [cuisine];
            const cuisineStrings = cuisineList.filter((c): c is string => typeof c === "string");
            queryObj.$or = cuisineStrings.map((c) => ({
                cuisine: { $regex: c, $options: "i" },
            }));
        }

        if (priceRange) {
            const prices = Array.isArray(priceRange) ? priceRange : [priceRange];
            queryObj.priceRange = { $in: prices };
        }

        if (rating) {
            queryObj.rating = { $gte: parseFloat(rating as string) };
        }

        if (location) {
            queryObj.location = { $regex: location as string, $options: "i" };
        }

        // Sorting
        let sortOption: any = { createdAt: -1 };
        if (sort === "rating") {
            sortOption = { rating: -1 };
        } else if (sort === "price_low") {
            sortOption = { priceRange: 1 };
        } else if (sort === "price_high") {
            sortOption = { priceRange: -1 };
        }

        const restaurants = await Restaurant.find(queryObj).sort(sortOption);
        res.json(restaurants);
    } catch (error: any) {
        console.error(error);
        res.status(400).json({ message: error.message });
    }
};

// Get featured restaurants
export const getFeaturedRestaurants = async (req: Request, res: Response): Promise<void> => {
    try {
        const restaurants = await Restaurant.find({ status: "approved" })
            .sort({ rating: -1 })
            .limit(6);
        res.json(restaurants);
    } catch (error: any) {
        console.error(error);
        res.status(400).json({ message: error.message });
    }
};

// Get restaurant by slug
export const getRestaurantBySlug = async (req: Request, res: Response): Promise<void> => {
    try {
        const restaurant = await Restaurant.findOne({
            slug: req.params.slug,
            status: "approved",
        });

        if (!restaurant) {
            res.status(404).json({ message: "Restaurant not found" });
            return;
        }

        res.json(restaurant);
    } catch (error: any) {
        console.error(error);
        res.status(400).json({ message: error.message });
    }
};

// Get restaurant availability
export const getRestaurantAvailability = async (req: Request, res: Response): Promise<void> => {
    try {
        const { date, guests } = req.query;
        const restaurant = await Restaurant.findById(req.params.id);

        if (!restaurant) {
            res.status(404).json({ message: "Restaurant not found" });
            return;
        }

        // Get all bookings for this restaurant on the selected date
        const bookings = await Booking.find({
            restaurant: restaurant._id,
            date: date,
            status: { $in: ["confirmed", "pending"] },
        } as any);

        // Calculate available seats per slot
        const availability = restaurant.availableSlots.map((slot: string) => {
            const slotBookings = bookings.filter((b) => b.time === slot);
            const bookedSeats = slotBookings.reduce((sum, b) => sum + (b.guests || 0), 0);
            const remainingSeats = restaurant.totalSeats - bookedSeats;

            return {
                time: slot,
                available: remainingSeats >= Number(guests || 1),
                remainingSeats,
            };
        });

        res.json(availability);
    } catch (error: any) {
        console.error(error);
        res.status(400).json({ message: error.message });
    }
};