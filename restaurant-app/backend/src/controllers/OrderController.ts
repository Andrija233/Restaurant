import Stripe from "stripe";
import { Request, Response } from "express";
import Restaurant, { MenuItemType } from "../models/restaurant";
import Order from "../models/order";

const STRIPE = new Stripe(process.env.STRIPE_API_KEY as string);
const FRONTEND_URL = process.env.FRONTEND_URL as string;

type CheckoutSessionRequest = {
    cartItems:{
        menuItemId: string;
        name: string;
        quantity: number;
    }[];
    deliveryDetails:{
        email: string;
        name: string;
        addressLine1: string;
        city: string;
    };
    restaurantId: string;
}

const createCheckoutSession = async (req: Request, res: Response) => {
    try {
        const checkoutSessionRequest : CheckoutSessionRequest = req.body;

        const restaurant = await Restaurant.findById(checkoutSessionRequest.restaurantId);

        if(!restaurant) {
            return res.status(404).json({ message: "Restaurant not found" });
        }

        const newOrder = new Order ({
            restaurant: restaurant,
            user: req.userId,
            status: "placed",
            deliveryDetails: checkoutSessionRequest.deliveryDetails,
            cartItems: checkoutSessionRequest.cartItems,
            createdAt: new Date()
        })

        const lineItems = createLineItems(checkoutSessionRequest, restaurant.menuItems);

        const session = await createSession(lineItems, newOrder._id.toString(), restaurant.deliveryPrice, restaurant._id.toString());

        if(!session.url) {
            return res.status(500).json({ message: "Failed to create checkout session" });
        }

        await newOrder.save();

        res.json({ url: session.url });
    } catch (error: any) {
        console.log(error);
        res.status(500).json({ message: error.raw.message });
    }
}

const createLineItems = (checkoutSessionRequest: CheckoutSessionRequest, menuItems : MenuItemType[]) => {
    // 1. foreach cartItem, get the menuItem object from the restaurant
    // to get the price
    // 2. foreach cartItem, convert it to a stripe line item
    // 3. return line item array

    const lineItems = checkoutSessionRequest.cartItems.map((item) => {
        const menuItem = menuItems.find((menuItem) => menuItem._id.toString() === item.menuItemId.toString());
        if(!menuItem) {
            throw new Error("Menu item not found: ${item.menuItemId}");
        }

        const line_item: Stripe.Checkout.SessionCreateParams.LineItem = {
            price_data: {
                currency: "usd",
                product_data: {
                    name: menuItem.name
                },
                unit_amount: menuItem.price
            },
            quantity: item.quantity
        }
        return line_item;
    });
    return lineItems;
}

const createSession = async(lineItems: Stripe.Checkout.SessionCreateParams.LineItem[], orderId: string, deliveryPrice: number, restaurantId: string) => {
    const sessionData = await STRIPE.checkout.sessions.create({
        line_items: lineItems,
        shipping_options : [
            {
                shipping_rate_data: {
                   display_name: "Delivery",
                   type: "fixed_amount",
                   fixed_amount: {
                       amount: deliveryPrice,
                       currency: "usd"
                   }
                }
            }
        ],
        mode: "payment",
        metadata:{
            orderId,
            restaurantId
        },
        success_url: `${FRONTEND_URL}/order-status?success=true`,
        cancel_url: `${FRONTEND_URL}/detail/${restaurantId}?cancelled=true`,
    });
    return sessionData;
}

export default { createCheckoutSession }