import React from "react";
import background from "../assets/wallpaper.png";
import styled from "styled-components";

const Container = styled.div`
  width: 100vw;
  height: 100vh;
  img {
    width: 100vw;
    height: 100vh;
  }
`;

const BackgroundImage = () => {
  return (
    <Container>
      <img src={background} alt="background" />
    </Container>
  );
};

export default BackgroundImage;
