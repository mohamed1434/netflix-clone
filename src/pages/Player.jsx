import React from "react";
import video from "../assets/video.mp4";
import styled from "styled-components";
import { ArrowLeft } from "phosphor-react";
import { useNavigate } from "react-router-dom";

const Container = styled.div`
  .player {
    position: relative;
    height: 100vh;
    width: 100vw;

    &:hover .back {
      opacity: 1; /* Show the arrow when hovering over .player */
    }

    .back {
      position: absolute;
      padding: 2rem;
      z-index: 1;
      opacity: 0; /* Hide the arrow by default */
      transition: opacity 0.3s ease; /* Add a smooth transition effect */
      svg {
        font-size: 3rem;
        cursor: pointer;
      }
    }

    video {
      height: 100%;
      width: 100%;
      object-fit: cover;
    }
  }
`;

const Player = () => {
  const navigate = useNavigate();
  return (
    <Container>
      <div className="player">
        <div className="back">
          <ArrowLeft onClick={() => navigate(-1)} />
        </div>
        <video src={video} autoPlay loop controls muted></video>
      </div>
    </Container>
  );
};

export default Player;
