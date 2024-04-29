import { UseGetRestaurant } from "@/api/RestaurantApi";
import MenuItem from "@/components/MenuItem";
import OrderSummary from "@/components/OrderSummary";
import RestaurantInfo from "@/components/RestaurantInfo";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Card } from "@/components/ui/card";
import { MenuItem as MenuItemType } from "@/types";
import { useState } from "react";
import { useParams } from "react-router-dom";

export type CartItem = {
    _id: string;
    name: string;
    price: number;
    quantity: number;
}

const DetailPage = () => {
    const { restaurantId } = useParams();
    const { restaurant, isLoading } = UseGetRestaurant(restaurantId);

    const [cartItems, setCartItems] = useState<CartItem[]>([]);

    const addToCart = (menuItem: MenuItemType) =>{
        setCartItems((prevItems) => {
            // 1. check if the item is already in the cart
            // 2. if item is in cart, update the quantity
            // 3. if item is not in cart, add it

            const existingItem = prevItems.find((item) => item._id === menuItem._id);

            if(existingItem) {
                return prevItems.map((item) => {
                    if(item._id === menuItem._id) {
                        return {...item, quantity: item.quantity + 1};
                    } else {
                        return item;
                    }
                });
            } else {
                return [...prevItems, {
                    _id: menuItem._id,
                    name: menuItem.name,
                    price: menuItem.price,
                    quantity: 1
                }];
            }
        });
    }

    if(isLoading || !restaurant) {
        return <span>Loading...</span>;
    }

    return (
        <div className="flex flex-col gap-10">
            <AspectRatio ratio={16 / 5}>
                <img className="rounded-md object-cover h-full w-full" src={restaurant.imageUrl} alt="" />
            </AspectRatio>
            <div className="grid md:grid-cols-[4fr_2fr] gap-5 md:px-32">
                <div className="flex flex-col gap-4">
                    <RestaurantInfo restaurant={restaurant}/>
                    <span className="text-2xl font-bold tracking-tight">Menu</span>
                    {restaurant.menuItems.map((menuItem) => (
                        <MenuItem menuItem={menuItem} />
                    ))}
                </div>

                <div>
                    <Card>
                        <OrderSummary restaurant={restaurant} cartItems={cartItems}/>
                    </Card>
                </div>
            </div>
        </div>
    )

}

export default DetailPage
