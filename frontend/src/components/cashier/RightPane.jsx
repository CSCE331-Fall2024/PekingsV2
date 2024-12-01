import React, { useEffect, useState, useRef } from 'react';
import editButtonImage from './Images/Edit-Btn.png';
import './RightPane.css';
import {useAuth0} from "@auth0/auth0-react";

/**
 * Compares two arrays to check if they are equal in terms of length and elements.
 * This function performs a shallow comparison, meaning it only compares the array elements
 * by their value (i.e., it does not handle deep comparison for objects or arrays within arrays).
 *
 * @param {Array} arr1 - The first array to compare.
 * @param {Array} arr2 - The second array to compare.
 * @returns {boolean} `true` if the arrays are equal (have the same length and identical elements),
 *                    otherwise `false`.
 *
 * @example
 * // Example usage:
 * const array1 = [1, 2, 3];
 * const array2 = [1, 2, 3];
 * const array3 = [4, 5, 6];
 * console.log(areArraysEqual(array1, array2)); // true
 * console.log(areArraysEqual(array1, array3)); // false
 */
// Compare arrays
const areArraysEqual = (arr1, arr2) => {
    if (arr1.length !== arr2.length) return false;
    for (let i = 0; i < arr1.length; i++) {
        if (arr1[i] !== arr2[i]) return false;
    }
    return true;
};

/**
 * The `RightPane` component displays the details of the current order, including items,
 * prices, and the subtotal, tax, and total amounts. It allows users to review and modify
 * the order, and process the payment by placing the order to the server.
 *
 * @component
 * @param {Object} props - The props passed to the component.
 * @param {Object} props.order - The current order object, which includes ordered items.
 * @param {function} props.centerChange - A function to change the view/screen (e.g., to 'payment').
 * @param {function} props.setProcessFunction - A function to set additional processing functions.
 * @param {Array} props.processFunctions - An array of functions to handle the order process.
 * @param {number} props.discount - The discount percentage applied to the order.
 * @param {Object} props.employee - The employee object who is handling the current order.
 *
 * @returns {JSX.Element} The order summary pane, which displays the ordered items, totals, and payment option.
 *
 * @example
 * // Example usage:
 * <RightPane
 *   order={orderData}
 *   centerChange={handleScreenChange}
 *   setProcessFunction={setProcessFunction}
 *   processFunctions={processFunctions}
 *   discount={0.1}
 *   employee={employeeData}
 * />
 *
 * @remarks
 * - The component handles order item display and modifications (such as adjusting ingredients).
 * - It calculates and displays the subtotal, tax, and total of the current order.
 */
// eslint-disable-next-line react/prop-types
function RightPane({ order, centerChange, setProcessFunction, processFunctions, discount, employee}) {
    const [subtotal, setSubtotal] = useState(0);
    const [tax, setTax] = useState(0);
    const [total, setTotal] = useState(0);
    const [orderItemsRows, setOrderItemsRows] = useState([]);
    const [orderItemsChecker, setOrderItemsChecker] = useState([]);
    const [ingredientNames, setIngredientNames] = useState([]);
    const { getAccessTokenSilently } = useAuth0();

    // Calculates all totals
    function calculateSubtotal(){
        let st = 0;

        for (let i = 0; i < order.orderItems.length; i++) {
            let menuItem = order.orderItems[i].menuItem;
            let menuItemTotal = menuItem.price;

            // For Nathan
            let ingredients = menuItem.ingredients;
            let noIngredients = (ingredients.length !== 0);
            for(let j = 0; j < ingredients.length; j++){
                if(ingredients[j].amount > 0){
                    noIngredients = false;
                }
                if(ingredients[j].amount > 1){
                    menuItemTotal += 0.5 * (ingredients[j].amount - 1);
                }
                if(ingredients[j].amount === 0){
                    menuItemTotal -= 0.5;
                }
            }
            if(!noIngredients){
                st += menuItemTotal;
            }
        }

        return parseFloat((st * (1 - discount)).toFixed(2));
    }

    function calculateTax(){
        let st = calculateSubtotal();
        let tax = parseFloat((st * 0.0625).toFixed(2));

        return tax;
    }

    function calculateTotal(){
        let st = calculateSubtotal();
        let tax = calculateTax();
        return parseFloat((st + tax).toFixed(2));
    }


    // Reinsert try statements when fixed
    const handleOrder = async (orderUse, paymentType, employee) => {
        try {
            let orderItems = orderUse.orderItems;
            let items = [];

            for(let i = 0; i < orderItems.length; i++){
                let menuItem = orderItems[i].menuItem;
                let ingredients = menuItem.ingredients;
                let addToOrder = false;

                for(let j = 0; j < ingredients.length; j++){
                    if(ingredients[j].amount > 0){
                        addToOrder = true;
                        break;
                    }
                }

                if(addToOrder){
                    let extraIngredients = [];
                    for(let j = 0; j < ingredients.length; j++){
                        if(ingredients[j].amount > 1){
                            extraIngredients.push({
                                ingredient: {id: ingredients[j].ingredient},
                                amount: (ingredients[j].amount - 1)
                            });
                        }else if(ingredients[j].amount < 1){
                            extraIngredients.push({
                                ingredient: {id: ingredients[j].ingredient},
                                amount: -1
                            });
                        }
                    }

                    items.push({
                        menuItem: {id: menuItem.id},
                        extras: extraIngredients
                    });

                }
            }


            // creating the order object
            const order = {
                customer: {
                    id: Math.floor(Math.random() * 1000) + 1
                },
                employee: {
                    id: employee.id
                },
                time: new Date().toISOString(),
                price: Number(calculateTotal().toFixed(2)),
                items: items,
                payment_method: paymentType,
                status: "incomplete"
            };
            // console.log(order);

            const token = await getAccessTokenSilently();
            console.log('Token:', token, typeof token);
            const response = await fetch('/api/orders/add', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(order)
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({ message: 'No error details available' }));
                throw new Error(`Server responded with ${response.status}: ${errorData.message}`);
            }

            const responseData = await response.json();

            //yippee it didnt fail
            alert('Order placed successfully!');
        }
        catch (error) {
            console.error('Error processing order:', error);
            alert(`Failed to place order: ${error.message}`);
        }
    };

    useEffect(() => {
        const fetchIngredients = async () => {
            try {
                const response = await fetch("/api/inventory/all", {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                    },
                });


                if (response.ok) {
                    const ingredients = await response.json();

                    setIngredientNames(ingredients);
                } else {
                    console.error("Failed to fetch ingredients:", response.status);
                }

            } catch (error) {
                console.error('Error finding ingredient:', error);
                alert(`Failed to find ingredient: ${error.message}`);
            }
        }

        fetchIngredients();
        const interval = setInterval(fetchIngredients, 1000); // Fetch every second

        return () => {
            clearInterval(interval); // Cleanup interval on unmount
        };
    }, []);

    const processPayment = (paymentType) => {
        if(order.orderItems.length === 0){
            alert("No order to place")
            return;
        }

        let placeOrder = false;
        for(let i = 0; i < order.orderItems.length; i++){
            let item = order.orderItems[i].menuItem;
            for(let j = 0; j < item.ingredients.length; j++){
                let ingredient = item.ingredients[j];
                if(ingredient.amount > 0){
                    placeOrder = true;
                    break;
                }
            }
            if(placeOrder){
                break;
            }
        }

        if(placeOrder){
            handleOrder(order, paymentType, employee);


            centerChange('menu');

            let total = calculateTotal();

            order.paidItems.push(...order.orderItems);
            order.amountPaid += total;
            order.amountPaid = parseFloat(order.amountPaid.toFixed(2));

            order.orderItems.length = 0;
            setSubtotal(0);
            setTax(0);
            setTotal(0);
        }else{
            alert("No menu items with valid ingredients");
        }
    };

    useEffect(() => {
        if (setProcessFunction) {
            setProcessFunction([...processFunctions, processPayment]);  // Passing the function to Component A
        }
    }, [setProcessFunction]);

    let removeItem = (menuItem) => () => {
        const index = order.orderItems.findIndex((item) => item === menuItem);
        if (index !== -1) {
            order.orderItems.splice(index, 1);
        }
    };

    function orderItemDisplay(item) {
        let name = item.menuItem.name;
        let price = parseFloat(item.menuItem.price);
        let ingredients = item.menuItem.ingredients;

        const handleDecrease = (ingredient) => {
            if(ingredient.amount > 0){
                ingredient.amount--;
                price -= 0.5;
            }
        }

        const handleIncrease = (ingredient) => {
            // Leave code for max extras
            // if(ingredient.amount < 2){
            ingredient.amount++;
            price += 0.5;
            // }
        }

        function findIngredientName(ingredient){
            for (let i = 0; i < ingredientNames.length; i++) {
                if (ingredientNames[i].id === ingredient.ingredient) {
                    return ingredientNames[i].name;
                }
            }
        }

        let ingredientsRows = [];
        if( (item.menuItem.category !== "drink") && (item.menuItem.category !== "dessert")){
            ingredientsRows = ingredients.map((ingredient, index) => (
                <div className="ingredient-row" key={index}>
                    <div className="ingredient-name">{findIngredientName(ingredient)}</div>
                    <div className="ingredient-editions">
                        <button className="changeIngredientAmount-Less"
                                onClick={() => handleDecrease(ingredient)}>&lt;</button>
                        <div className="ingredientAmount">
                            {ingredient.amount === 0 && ("None")}
                            {ingredient.amount === 1 && ("Normal")}
                            {ingredient.amount > 1 && "Extra: " + (ingredient.amount - 1)}

                        </div>
                        <button className="changeIngredientAmount-Less"
                                onClick={() => handleIncrease(ingredient)}>&gt;
                        </button>
                    </div>
                </div>
            ));

            return (
                <div className="orderItemContainer">
                    <div className="orderItemRow">
                        <button className="orderItemRowText">
                            <div className="orderItemsText">{name}</div>
                            <div className="orderItemsPrice">${price.toFixed(2)}</div>
                        </button>
                        <button className="editBtn" onClick={() => item.editStatus = !item.editStatus}>
                            <img src={editButtonImage}
                                 className="editBtnIcon"
                            />
                        </button>
                        <button className="orderItemX" onClick={removeItem(item)}>X</button>
                    </div>

                    {item.editStatus && (
                        <div className="ingredients-list">
                            {ingredientsRows}
                        </div>
                    )}
                </div>
            );
        }


        return (
            <div className="orderItemContainer">
            <div className="orderItemRow">
                    <button className="orderItemRowText">
                        <div className="orderItemsText">{name}</div>
                        <div className="orderItemsPrice">${price.toFixed(2)}</div>
                    </button>
                    <button className="editBtn" onClick={() => item.editStatus = !item.editStatus}></button>
                    <button className="orderItemX" onClick={removeItem(item)}>X</button>
                </div>

                {item.editStatus && (
                    <div className="ingredients-list">
                        {ingredientsRows}
                    </div>
                )}
            </div>
        );
    }

    function paidItemDisplay(menuItem) {
        let name = menuItem.menuItem.name;
        let price = menuItem.menuItem.price;
        return (
            <div className="orderItemRow">
                <button className="orderItemRowText">
                    <div className="paidItemsText">{name}</div>
                    <div className="paidItemsPrice">${price}</div>
                </button>
            </div>
        );
    }

    function createPaidText() {
        return (
            <div className="orderItemRow">
                <div className="paidItemText">Payment Complete</div>
            </div>
        )
    }

    function createDiscountText(){
        return (
            <div className="orderItemRow">
                <div className="discountText">{discount * 100}% Discount Applied</div>
            </div>
        );
    }

    const updateOrderItems = () => {
        // Make sure to update the combined list of all items: unpaid + paid
        const paidRows = order.paidItems.map((item) => paidItemDisplay(item));
        if(paidRows.length > 0){
            paidRows.push(createPaidText());
        }

        const unpaidRows = order.orderItems.map((item) => orderItemDisplay(item));
        if(unpaidRows.length > 0 && discount > 0){
            unpaidRows.push(createDiscountText());
        }

        setOrderItemsRows([...paidRows, ...unpaidRows]);

        if(!areArraysEqual(order.orderItems, orderItemsChecker)){
            setOrderItemsChecker([...order.orderItems]);
        }
    };

    const containerRef = useRef(null);

    useEffect(() => {
        const container = containerRef.current;
        if (container) {
            container.scrollTop = container.scrollHeight;
        }
    }, [orderItemsChecker]);

    const updateOrderTotal = () => {
        setSubtotal(calculateSubtotal());
        setTax(calculateTax());
        setTotal(calculateTotal());
    };

    useEffect(() => {
        updateOrderItems(); // Update the items when `paidItemsRows` or `unpaidItemRows` change
        updateOrderTotal(); // Update totals whenever orderItems change

        // Cleanup intervals, though using `setInterval` may not be necessary
        const intervalId1 = setInterval(updateOrderItems, 1);
        const intervalId2 = setInterval(updateOrderTotal, 1);

        return () => {
            clearInterval(intervalId1);
            clearInterval(intervalId2);
        } // Cleanup on unmount
    }, [orderItemsChecker, discount]); // Depend on unpaid and paid items

    return (
        <div className="rightRect">
            <div className="rightPaneContainer1-cash">
                <div className="orderNumberContainer-cash">
                    <div className="orderNumber">Order<br />#{order.id}</div>
                </div>

                <hr className="separator" />

                <div className="orderItemsContainer" ref={containerRef}>
                    {orderItemsRows}
                </div>
                <hr className="separator" />

                <div className="priceContainer">
                    <div className="subtotal">Subtotal: ${subtotal.toFixed(2)}</div>
                    <div className="tax">Tax: ${tax.toFixed(2)}</div>
                    <div className="total">Total: ${total.toFixed(2)}</div>
                </div>
            </div>

            <button className="pay" onClick={() => centerChange('payment')}>Pay</button>
        </div>
    );
}

export default RightPane;
