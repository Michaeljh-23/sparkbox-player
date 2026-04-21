import { useEffect, useRef, useState } from "react";

const WIDTH = 520;
const HEIGHT = 320;
const PADDLE_WIDTH = 12;
const PADDLE_HEIGHT = 72;
const BALL_SIZE = 12;
const PLAYER_X = 18;
const CPU_X = WIDTH - PLAYER_X - PADDLE_WIDTH;
const WINNING_SCORE = 7;

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

function createInitialState() {
  return {
    playerY: HEIGHT / 2 - PADDLE_HEIGHT / 2,
    cpuY: HEIGHT / 2 - PADDLE_HEIGHT / 2,
    ballX: WIDTH / 2 - BALL_SIZE / 2,
    ballY: HEIGHT / 2 - BALL_SIZE / 2,
    velocityX: -4.4,
    velocityY: 2.6,
    playerScore: 0,
    cpuScore: 0,
    running: false,
    winner: null,
  };
}

export default function PongPanel() {
  const [game, setGame] = useState(createInitialState);
  const frameRef = useRef(0);
  const gameRef = useRef(game);
  const panelRef = useRef(null);
  const pointerYRef = useRef(HEIGHT / 2);

  useEffect(() => {
    gameRef.current = game;
  }, [game]);

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === " " || event.key === "Enter") {
        event.preventDefault();
        setGame((current) => {
          if (current.winner) {
            return { ...createInitialState(), running: true };
          }

          return { ...current, running: !current.running };
        });
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  useEffect(() => {
    const tick = () => {
      setGame((current) => {
        if (!current.running || current.winner) {
          return current;
        }

        let nextPlayerY = clamp(
          pointerYRef.current - PADDLE_HEIGHT / 2,
          10,
          HEIGHT - PADDLE_HEIGHT - 10,
        );
        let nextCpuY = current.cpuY + (current.ballY - current.cpuY - 24) * 0.08;
        nextCpuY = clamp(nextCpuY, 10, HEIGHT - PADDLE_HEIGHT - 10);

        let nextBallX = current.ballX + current.velocityX;
        let nextBallY = current.ballY + current.velocityY;
        let nextVelocityX = current.velocityX;
        let nextVelocityY = current.velocityY;
        let nextPlayerScore = current.playerScore;
        let nextCpuScore = current.cpuScore;
        let winner = null;

        if (nextBallY <= 10 || nextBallY >= HEIGHT - BALL_SIZE - 10) {
          nextVelocityY *= -1;
          nextBallY = clamp(nextBallY, 10, HEIGHT - BALL_SIZE - 10);
        }

        const playerCollision =
          nextBallX <= PLAYER_X + PADDLE_WIDTH &&
          nextBallX >= PLAYER_X - BALL_SIZE &&
          nextBallY + BALL_SIZE >= nextPlayerY &&
          nextBallY <= nextPlayerY + PADDLE_HEIGHT;

        if (playerCollision && nextVelocityX < 0) {
          nextVelocityX = Math.abs(nextVelocityX) + 0.22;
          const offset =
            (nextBallY + BALL_SIZE / 2 - (nextPlayerY + PADDLE_HEIGHT / 2)) /
            (PADDLE_HEIGHT / 2);
          nextVelocityY = offset * 4.2;
          nextBallX = PLAYER_X + PADDLE_WIDTH + 2;
        }

        const cpuCollision =
          nextBallX + BALL_SIZE >= CPU_X &&
          nextBallX <= CPU_X + PADDLE_WIDTH + BALL_SIZE &&
          nextBallY + BALL_SIZE >= nextCpuY &&
          nextBallY <= nextCpuY + PADDLE_HEIGHT;

        if (cpuCollision && nextVelocityX > 0) {
          nextVelocityX = -Math.abs(nextVelocityX) - 0.18;
          const offset =
            (nextBallY + BALL_SIZE / 2 - (nextCpuY + PADDLE_HEIGHT / 2)) /
            (PADDLE_HEIGHT / 2);
          nextVelocityY = offset * 3.9;
          nextBallX = CPU_X - BALL_SIZE - 2;
        }

        if (nextBallX < -BALL_SIZE) {
          nextCpuScore += 1;
          nextBallX = WIDTH / 2 - BALL_SIZE / 2;
          nextBallY = HEIGHT / 2 - BALL_SIZE / 2;
          nextVelocityX = 4.2;
          nextVelocityY = 2.4;
        }

        if (nextBallX > WIDTH + BALL_SIZE) {
          nextPlayerScore += 1;
          nextBallX = WIDTH / 2 - BALL_SIZE / 2;
          nextBallY = HEIGHT / 2 - BALL_SIZE / 2;
          nextVelocityX = -4.2;
          nextVelocityY = -2.4;
        }

        if (nextPlayerScore >= WINNING_SCORE) {
          winner = "YOU WIN";
        } else if (nextCpuScore >= WINNING_SCORE) {
          winner = "CPU WINS";
        }

        return {
          playerY: nextPlayerY,
          cpuY: nextCpuY,
          ballX: nextBallX,
          ballY: nextBallY,
          velocityX: nextVelocityX,
          velocityY: nextVelocityY,
          playerScore: nextPlayerScore,
          cpuScore: nextCpuScore,
          running: !winner,
          winner,
        };
      });

      frameRef.current = window.requestAnimationFrame(tick);
    };

    frameRef.current = window.requestAnimationFrame(tick);
    return () => window.cancelAnimationFrame(frameRef.current);
  }, []);

  const updatePointer = (clientY) => {
    const bounds = panelRef.current?.getBoundingClientRect();
    if (!bounds) return;
    const relativeY = ((clientY - bounds.top) / bounds.height) * HEIGHT;
    pointerYRef.current = clamp(relativeY, 0, HEIGHT);
  };

  return (
    <div className="game-panel">
      <div className="game-copy">
        <p className="audio-label">Mini Game</p>
        <h2>Pong.app</h2>
        <p>Move your paddle with the mouse or finger. Press space to pause or restart.</p>
      </div>
      <div
        ref={panelRef}
        className="pong-stage"
        onMouseMove={(event) => updatePointer(event.clientY)}
        onPointerDown={(event) => {
          updatePointer(event.clientY);
          setGame((current) =>
            current.winner ? { ...createInitialState(), running: true } : { ...current, running: true },
          );
        }}
        onPointerMove={(event) => {
          if (event.pointerType === "touch") {
            updatePointer(event.clientY);
          }
        }}
      >
        <div className="pong-scoreboard">
          <span>SPARKBOX</span>
          <strong>{game.playerScore}</strong>
          <span>CPU</span>
          <strong>{game.cpuScore}</strong>
        </div>
        <div className="pong-midline" aria-hidden="true" />
        <div
          className="pong-paddle is-player"
          style={{ transform: `translate(${PLAYER_X}px, ${game.playerY}px)` }}
        />
        <div
          className="pong-paddle is-cpu"
          style={{ transform: `translate(${CPU_X}px, ${game.cpuY}px)` }}
        />
        <div
          className="pong-ball"
          style={{ transform: `translate(${game.ballX}px, ${game.ballY}px)` }}
        />
        {!game.running && !game.winner ? (
          <div className="pong-overlay">Click to serve</div>
        ) : null}
        {game.winner ? (
          <div className="pong-overlay is-win">
            <span>{game.winner}</span>
            <button
              type="button"
              className="pong-restart"
              onClick={() => setGame({ ...createInitialState(), running: true })}
            >
              Play again
            </button>
          </div>
        ) : null}
      </div>
    </div>
  );
}
