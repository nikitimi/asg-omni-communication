"use client";
import React, { useEffect, useRef, useState } from "react";
import SimplePeer from "simple-peer";

export default function VoicePeer() {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [peer, setPeer] = useState<SimplePeer.Instance | null>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const signalingServer = new WebSocket("wss://localhost:8080");

  // Start the call
  function handleCallButton() {
    if (!stream) return;

    setPeer(
      new SimplePeer({
        initiator: true,
        trickle: false,
        stream: stream,
      })
    );

    if (!peer) return;

    peer.on("signal", (data) => {
      signalingServer.send(JSON.stringify(data)); // Send signaling data to the other peer
    });
  }

  useEffect(() => {
    const abortController = new AbortController();

    // Get user media (audio)
    navigator.mediaDevices
      .getUserMedia({ audio: true })
      .then((stream) => {
        // Create a new peer connection
        setPeer(
          new SimplePeer({
            initiator: false,
            trickle: false,
            stream: stream,
          })
        );

        if (!peer) return;

        // Handle signaling data
        peer.on("signal", (data) => {
          signalingServer.send(JSON.stringify(data)); // Send signaling data to the other peer
        });

        // Receive signaling data from the other peer
        signalingServer.onmessage = (event) => {
          const data = JSON.parse(event.data);
          peer.signal(data);
        };

        // Handle remote stream
        peer.on("stream", (remoteStream) => {
          if (!audioRef.current) return;
          audioRef.current.srcObject = remoteStream; // Play the remote audio
        });

        // Handle errors
        peer.on("error", (err) => {
          console.error("Peer error:", err);
        });
      })
      .catch((err) => {
        console.error("Error accessing microphone:", err);
      });

    return () => {
      abortController.abort();
    };
  }, [peer]);

  return (
    <div>
      <h2>VoicePeer</h2>
      <button onClick={handleCallButton}>Call</button>
      <audio ref={audioRef} autoPlay></audio>
    </div>
  );
}
