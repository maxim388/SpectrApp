import { Flex, Spin } from "antd";
import { useEffect, useState } from "react";

const Loader = () => {
  const [loader, setLoader] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setLoader(false);
    }, "3000");
  }, []);

  return (
    <>
      {loader ? (
        <Flex
          align="center"
          justify="center"
          style={{
            height: "100%",
            minHeight: 50,
            width: "100%",
          }}
        >
          <Spin size="large" />
        </Flex>
      ) : (
        <div
          style={{
            height: "100%",
            minHeight: 50,
            width: "100%",
          }}
        ></div>
      )}
    </>
  );
};

export default Loader;
