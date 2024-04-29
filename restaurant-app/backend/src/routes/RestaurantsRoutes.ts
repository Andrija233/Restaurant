import express from "express";
import { param } from "express-validator";
import RestaurantsController from "../controllers/RestaurantsController";


const router = express.Router();

// /api/restaurant/:restaurantId
router.get("/:restaurantId", param("restaurantId").isString().trim().notEmpty().withMessage("RestaurantId must be a string"), RestaurantsController.getRestaurants);

// /api/restaurant/search/london
router.get("/search/:city", param("city").isString().trim().notEmpty().withMessage("City must be a string"), RestaurantsController.searchRestaurants);


export default router;