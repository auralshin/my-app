import React, { useEffect, useState } from "react";
import { Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, Spinner, getKeyValue, } from "@nextui-org/react";

const MatchedOrder = () => {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const ws = new WebSocket('ws://localhost:8080/ws/');

    ws.onopen = () => {
      console.log("WebSocket Connected");
      setIsLoading(false);
    };

    ws.onmessage = (event) => {
      const message = JSON.parse(event.data);
      // Assuming the message is an object containing the new data
      setData(prevData => [...prevData, message]);
    };

    ws.onerror = (error) => {
      console.error("WebSocket Error: ", error);
    };

    ws.onclose = () => {
      console.log("WebSocket Disconnected");
    };

    return () => {
      ws.close();
    };
  }, []);

  return (
    <Table
      aria-label="Dynamic table updated via WebSocket"
      classNames={{ table: "min-h-[400px]" }}
    >
       <TableHeader>
              <TableColumn key="id">Order Id</TableColumn>
              <TableColumn key="matched_with_id">Matched Order Id</TableColumn>
              <TableColumn key="amount">Amount</TableColumn>
              <TableColumn key="price">Amount</TableColumn>
              <TableColumn key="order_type">Order Type</TableColumn>
              <TableColumn key="bid_or_ask">Bid or Ask</TableColumn>
            </TableHeader>
            <TableBody
              isLoading={isLoading}
              items={data}
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
  );
};

export default MatchedOrder;
