import express from "express";
import multer from "multer";
import RestaurantController from "../controllers/RestaurantController";
import { jwtCheck, jwtParse } from "../middleware/auth";
import { validateMyRestaurantRequest } from "../middleware/validation";

const router = express.Router();

const storage = multer.memoryStorage();
const upload = multer({
    storage: storage,
    limits: {
        fileSize: 5 * 1024 * 1024 //5mb
    }
});

// /api/my/restaurant

//GET /api/my/restaurant/order
router.get("/order", jwtCheck, jwtParse, RestaurantController.getMyRestaurantOrders);
//PATCH /api/my/restaurant/order/:orderId/status
router.patch("/order/:orderId/status", jwtCheck, jwtParse, RestaurantController.updateOrderStatus);

// GET /api/my/restaurant
router.get("/", jwtCheck, jwtParse, RestaurantController.getMyRestaurant);
// POST /api/my/restaurant
router.post("/", upload.single("imageFile"), validateMyRestaurantRequest, jwtCheck, jwtParse, RestaurantController.createMyRestaurant);
// PUT /api/my/restaurant
router.put("/", upload.single("imageFile"), validateMyRestaurantRequest, jwtCheck, jwtParse, RestaurantController.updateMyRestaurant);
// DELETE /api/my/restaurant
//router.delete("/", jwtCheck, jwtParse, RestaurantController.deleteMyRestaurant);


export default router;

