"use client";

import OrderForm from "@/components/createOrder";
import Image from "next/image";
import {
  NextUIProvider,
  Pagination,
  Spinner,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
  getKeyValue,
} from "@nextui-org/react";
import { list } from "postcss";
import React from "react";
import { useInfiniteScroll } from "@nextui-org/use-infinite-scroll";
import { useAsyncList } from "@react-stately/data";
import MatchedOrder from "@/components/matchedOrder";

export default function Home() {
  const [isLoading, setIsLoading] = React.useState(true);
  const [listItems, setListItems] = React.useState([]);
  const [reloadTrigger, setReloadTrigger] = React.useState(0);
  const fetchData = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("http://127.0.0.1:8080/orders");
      const json = await response.json();
      if (!Array.isArray(json)) {
        console.error("Expected 'results' to be an array, but got:", json);
        setListItems([]);
      } else {
        setListItems(json);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
    setIsLoading(false);
  };

  // Effect to trigger reload
  React.useEffect(() => {
    fetchData();
  }, [reloadTrigger]);

  const handleRefetch = () => {
    setReloadTrigger(prev => prev + 1); // Update the trigger to refetch
  };

  return (
    <NextUIProvider>
      <div className="flex justify-center items-center text-center h-[100vh] w-[100vw]">
        <div className="bg-red-300 h-full w-full flex flex-col justify-center items-center">
          <div className="text-2xl">Place Order</div>
          <div>
            <OrderForm />
          </div>
        </div>
        <div className="bg-blue-300 h-full w-full object-center flex flex-col justify-center items-center">
          <div className="text-2xl">Current Market Orders <div onClick={() => handleRefetch()}>Reload</div></div>
          <Table
            isHeaderSticky
            aria-label="Example table with infinite pagination"
            classNames={{
              base: "max-h-[520px] overflow-scroll",
              table: "min-h-[400px]",
            }}
          >
            <TableHeader>
              <TableColumn key="id">Order Id</TableColumn>
              <TableColumn key="amount">Amount</TableColumn>
              <TableColumn key="price">Amount</TableColumn>
              <TableColumn key="order_type">Order Type</TableColumn>
              <TableColumn key="trading_pair">Trading Pair</TableColumn>
              <TableColumn key="bid_or_ask">Bid or Ask</TableColumn>
            </TableHeader>
            <TableBody
              isLoading={isLoading}
              items={listItems}
              loadingContent={<Spinner color="white" />}
            >
              {(item: any) => (
                <TableRow key={item.id}>
                  {(columnKey) => (
                    <TableCell>
                      {columnKey === "price"
                        ? `${item.price.integral}.${item.price.fractional}` // Adjust the display format as needed
                        : getKeyValue(item, columnKey)}
                    </TableCell>
                  )}
                </TableRow>
              )}
            </TableBody>
          </Table>
          <div>Matched Orders</div>
          <MatchedOrder />
        </div>
      </div>
    </NextUIProvider>
  );
}
