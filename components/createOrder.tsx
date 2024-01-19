import React from "react";
import {
  Tabs,
  Tab,
  Input,
  Link,
  Button,
  Card,
  CardBody,
  CardHeader,
  Select,
  SelectItem,
} from "@nextui-org/react";
import axios from "axios";
interface IOrder {
  order_type: "Market" | "Limit";
  trading_pair: string;
  amount: number;
  price: {
    integral: number;
    fractional: number;
    scalar: number;
  };
}

export default function App() {
  const [selected, setSelected] = React.useState("sell");
  const [orderTypeState, setOrderTypeState] = React.useState("Market");
  const [tradingPairState, setTradingPairState] = React.useState("BTC-USDT");
  const [amountState, setAmountState] = React.useState(0);
  const [priceState, setPriceState] = React.useState({
    integral: 0,
    fractional: 0,
    scalar: 100,
  });

  const handleSubmit = (
    e: React.FormEvent<HTMLFormElement>,
    askOrBid: String
  ) => {
    e.preventDefault();
    const id = Math.floor(Math.random() * 1000);
    const timestamp = Math.floor(new Date().getTime() / 1000);
    const orderToSubmit = {
      id,
      timestamp,
      order_type: orderTypeState,
      trading_pair: tradingPairState,
      amount: amountState,
      price: priceState,
      bid_or_ask: askOrBid,
    };
    axios
      .post("http://localhost:8080/orders", orderToSubmit)
      .then((res) => {
        console.log(res);
      })
      .catch((err) => {
        console.log(err);
      });
    console.log(orderToSubmit);
  };
  const orderType = [
    {
      label: "Market",
      value: "Market",
    },
    {
      label: "Limit",
      value: "Limit",
    },
  ];

  const tradingPair = [
    {
      label: "BTC/USDT",
      value: "BTC-USDT",
    },
    {
      label: "ETH/USDT",
      value: "ETH-USDT",
    },
  ];

  const handlePrice = (value: string) => {
    const [integral, fractional] = value.split(".");
    const price = {
      integral: parseInt(integral),
      fractional: parseInt(fractional),
      scalar: 100,
    };
    setPriceState({
      ...priceState,
      ...price,
    });
  };

  return (
    <div className="flex flex-col w-full">
      <Card className="max-w-full w-[340px] h-[400px]">
        <CardBody className="overflow-hidden">
          <Tabs
            fullWidth
            size="md"
            aria-label="Tabs form"
            selectedKey={selected}
            onSelectionChange={setSelected}
          >
            <Tab key="buy" title="Buy">
              <form className="flex flex-col gap-4">
                <Input
                  label="Amount"
                  placeholder="400"
                  type="text"
                  name="amount"
                  onChange={(e) => setAmountState(parseInt(e.target.value))}
                />
                <Input
                  label="Price"
                  placeholder="40000"
                  type="text"
                  name="price"
                  onChange={(e) => handlePrice(e.target.value)}
                />
                <Select
                  items={orderType}
                  label="Order Type"
                  placeholder="Select an animal"
                  className="max-w-xs"
                  name="order_type"
                  onChange={(e) => setOrderTypeState(e.target.value)}
                >
                  {(orderType) => (
                    <SelectItem key={orderType.value}>
                      {orderType.label}
                    </SelectItem>
                  )}
                </Select>
                <Select
                  items={tradingPair}
                  label="Trading Pair"
                  placeholder="Select an animal"
                  className="max-w-xs"
                  name="trading_pair"
                  onChange={(e) => setTradingPairState(e.target.value)}
                >
                  {(tradingPair) => (
                    <SelectItem key={tradingPair.value}>
                      {tradingPair.label}
                    </SelectItem>
                  )}
                </Select>
                <div className="flex gap-2 justify-end">
                  <Button
                    fullWidth
                    className="bg-green-400"
                    onClick={(e) => handleSubmit(e, "Bid")}
                  >
                    Buy
                  </Button>
                </div>
              </form>
            </Tab>
            <Tab key="sell" title="Sell">
              <form className="flex flex-col gap-4 h-[300px]">
                <Input
                  isRequired
                  label="Amount"
                  placeholder="400"
                  type="text"
                  onChange={(e) => setAmountState(parseInt(e.target.value))}
                />
                <Input
                  isRequired
                  label="Price"
                  placeholder="40000"
                  type="text"
                  onChange={(e) => handlePrice(e.target.value)}
                />
                <Select
                  items={orderType}
                  label="Order Type"
                  placeholder="Select an animal"
                  className="max-w-xs"
                  onChange={(e) => setOrderTypeState(e.target.value)}
                >
                  {(orderType) => (
                    <SelectItem key={orderType.value}>
                      {orderType.label}
                    </SelectItem>
                  )}
                </Select>
                <Select
                  items={tradingPair}
                  label="Trading Pair"
                  placeholder="Select an animal"
                  className="max-w-xs"
                  onChange={(e) => setTradingPairState(e.target.value)}
                >
                  {(tradingPair) => (
                    <SelectItem key={tradingPair.value}>
                      {tradingPair.label}
                    </SelectItem>
                  )}
                </Select>

                <div className="flex gap-2 justify-end">
                  <Button
                    fullWidth
                    className="bg-red-400"
                    onClick={(e) => handleSubmit(e, "Ask")}
                  >
                    Sell
                  </Button>
                </div>
              </form>
            </Tab>
          </Tabs>
        </CardBody>
      </Card>
    </div>
  );
}
