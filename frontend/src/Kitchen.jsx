import React, {useEffect, useState} from 'react';
import "./Kitchen.css";

function Kitchen() {
    const [currentOrders, setCurrentOrders] = useState([]);
    const [officialMenuItems, setOfficialMenuItems] = useState([]);

    // Gets all the current active orders
    useEffect(() => {
        const fetchItems = async () => {
            try {
                const response = await fetch("/api/orders/69350", {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                    },
                });

                if (response.ok) {
                    const orderList = await response.json();
                    setCurrentOrders([...currentOrders, orderList, orderList]);
                } else {
                    console.error("Failed to fetch orders:", response.status);
                }
            } catch (error) {
                console.error("Error fetching orders:", error);
            }
        };

        fetchItems();
    }, []);

    // Gets all the menu items for changing an ID into a name
    useEffect(() => {
        const fetchItems = async () => {
            try {
                const response = await fetch("/api/menuitem/all", {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                    },
                });

                if (response.ok) {
                    const menuItemList = await response.json();

                    setOfficialMenuItems(menuItemList);
                } else {
                    console.error("Failed to fetch menu items:", response.status);
                }
            } catch (error) {
                console.error("Error fetching menu items:", error);
            }
        };

        fetchItems();
    }, []);

    function createItemContainer(item){
        const officialItem = officialMenuItems.find(menuItem => menuItem.id === item.menu_item_id).name;

        return (
            <div className="Item-Container">
                {officialItem}
            </div>
        )
    }

    function createOrderContainer(order){
        let orderItems = order.items;

        let orderItemsContainers = [];
        for (let i = 0; i < orderItems.length; i++) {
            orderItemsContainers.push(createItemContainer(orderItems[i]));
        }

        return (
            <div className="Kitchen-Order">
                <div className="Order-Header">
                    <div className="Order-Number">ID: {order.order_id}</div>
                </div>

                <div className="Order-Container">
                    {orderItemsContainers}
                </div>
            </div>
        )
    }


    // Checks if the objects exist, if not gives a default




    let orderContainers = [];
    for(let i = 0; i < currentOrders.length; i++) {
        orderContainers.push(createOrderContainer(currentOrders[i]));
    }

    return (
        <div className="Kitchen-Screen">
            {orderContainers}
        </div>
    )
}

export default Kitchen;