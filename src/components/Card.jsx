import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import video from "../assets/video.mp4";
import {
  CaretDown,
  Check,
  Play,
  PlusCircle,
  ThumbsDown,
  ThumbsUp,
} from "phosphor-react";
import axios from "axios";
import { BACK_END_URL } from "../utils/constants";
import { firebaseAuth } from "../utils/firebase-config";
import { onAuthStateChanged } from "firebase/auth";
import { fetchMovieTrailers, removeMovieFromLiked } from "../store";
import { useDispatch, useSelector } from "react-redux";

const Container = styled.div`
  max-width: 230px;
  width: 230px;
  height: 100%;
  cursor: pointer;
  position: relative;
  img {
    border-radius: 0.2rem;
    width: 100%;
    height: 100%;
    z-index: 10; //10
  }
  .hover {
    z-index: 99; //99
    height: max-content;
    width: 20rem;
    position: absolute;
    top: -18vh;
    left: 0;
    border-radius: 0.3rem;
    box-shadow: rgba(0, 0, 0, 0.75) 0px 3px 10px;
    background-color: #181818;
    transition: 0.3s ease-in-out;
    .image-video-container {
      position: relative;
      height: 140px;
      img {
        width: 100%;
        height: 140px;
        object-fit: cover;
        border-radius: 0.3rem;
        top: 0;
        z-index: 4;
        position: absolute;
      }
      iframe { //video
        width: 100%;
        height: 140px;
        object-fit: cover;
        border-radius: 0.3rem;
        top: 0;
        z-index: 5;
        position: absolute;
      }
    }
    .info-container {
      padding: 1rem;
      gap: 0.5rem;
    }
    .icons {
      .controls {
        display: flex;
        gap: 1rem;
      }
      svg {
        font-size: 2rem;
        cursor: pointer;
        transition: 0.3s ease-in-out;
        &:hover {
          color: #b8b8b8;
        }
      }
    }
    .genres {
      ul {
        gap: 1rem;
        li {
          padding-right: 0.7rem;
          &:first-of-type {
            list-style-type: none;
          }
        }
      }
    }
  }
`;

const Card = React.memo(({ movieData, isLiked = false }) => {
  const [isHovered, setIsHovered] = useState(false);
  const navigate = useNavigate();
  const [email, setEmail] = useState(undefined);
  const dispatch = useDispatch();
  const movieTrailers = useSelector((state) => state.netflix.movieTrailers);

  onAuthStateChanged(firebaseAuth, (currentUser) => {
    if (currentUser) setEmail(currentUser.email);
    else navigate("/login");
  });

  const addToList = async () => {
    try {
      await axios.post(`${BACK_END_URL}/user/add`, { email, data: movieData });
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    // Dispatch fetchMovieTrailers action when the component mounts
    dispatch(fetchMovieTrailers(movieData.id));
  }, [dispatch, movieData.id]);

  return (
    <Container
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <img
        src={`https://image.tmdb.org/t/p/w500/${movieData.image}`}
        alt="movie"
      />
      {isHovered && (
        <div className="hover">
          <div className="image-video-container">
            <img
              src={`https://image.tmdb.org/t/p/w500/${movieData.image}`}
              alt="movie"
              onClick={() => navigate("/player")}
            />
            {/* <video
              src={video}
              autoPlay
              loop
              muted
              onClick={() => navigate("/play")}
            /> */}
            {movieTrailers[movieData.id] &&
              movieTrailers[movieData.id].length > 0 && (
                <iframe
                  title="Trailer"
                  src={`https://www.youtube.com/embed/${
                    movieTrailers[movieData.id]?.[0]?.key
                  }`}
                  allowFullScreen
                  autoplay
                />
              )}
          </div>
          <div className="info-container flex column ">
            <h3 className="name" onClick={() => navigate("/player")}>
              {movieData.name}
            </h3>
            <div className="icons flex j-between">
              <div className="controls flex">
                <Play
                  xlinkTitle="Play"
                  onClick={() => navigate("/player")}
                  weight="fill"
                />
                <ThumbsUp xlinkTitle="Like" weight="fill" />
                <ThumbsDown xlinkTitle="Dislike" weight="fill" />
                {isLiked ? (
                  <Check
                    xlinkTitle="Remove From List"
                    onClick={() =>
                      dispatch(
                        removeMovieFromLiked({ movieId: movieData.id, email })
                      )
                    }
                  />
                ) : (
                  <PlusCircle
                    xlinkTitle="Add To My List"
                    weight="fill"
                    onClick={addToList}
                  />
                )}
              </div>
              <div className="info">
                <CaretDown xlinkTitle="More Info" />
              </div>
            </div>
            <div className="genres flex">
              <ul className="flex">
                {movieData.genres.map((genre) => (
                  <li key={genre}>{genre}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}
    </Container>
  );
});

export default Card;
