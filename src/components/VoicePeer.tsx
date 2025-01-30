"use client";
import React, { useState, useEffect, useRef, useCallback } from "react";
import SimplePeer from "simple-peer";

interface SignalData {
  type: string;
  userId?: string;
  target?: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data?: any;
}

const VoicePeer: React.FC = () => {
  const userRef = useRef<HTMLInputElement | null>(null);
  const [userId, setUserId] = useState<string>("");
  const [targetUserId, setTargetUserId] = useState<string>("");
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const [remoteStream, setRemoteStream] = useState<MediaStream | null>(null);
  const [ws, setWs] = useState<WebSocket | null>(null);
  const [peer, setPeer] = useState<SimplePeer.Instance | null>(null);
  const [mediaError, setMediaError] = useState<string | null>(null);
  const [status, setStatus] = useState<string>("Not logged in");
  const [isCallActive, setIsCallActive] = useState<boolean>(false);

  const localAudioRef = useRef<HTMLAudioElement>(null);
  const remoteAudioRef = useRef<HTMLAudioElement>(null);

  // Set up local audio stream
  async function getMedia() {
    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error("getUserMedia is not supported in this browser.");
      }

      const stream = await navigator.mediaDevices.getUserMedia({
        audio: true,
        video: false,
      });
      setLocalStream(stream);
      setMediaError(null);
      if (localAudioRef.current) {
        localAudioRef.current.srcObject = stream;
      }
      return stream;
    } catch (error) {
      console.error("Error accessing media devices:", error);
      setMediaError(
        "Failed to access microphone. Please allow permissions and try again."
      );
      return null;
    }
  }
  function handleLogin() {
    if (!userRef.current) return console.log("User reference is null.");
    setUserId(userRef.current.value);

    if (ws) {
      ws?.send(
        JSON.stringify({ type: "login", userId: userRef.current.value })
      );
      setStatus(`Logged in as ${userRef.current.value}`);
    }
  }
  async function handleCall() {
    if (!ws || !userId || !targetUserId) return;

    if (!localStream) {
      const stream = await getMedia();
      if (!stream) return;
    }

    console.log("Initiating call to:", targetUserId);

    const newPeer = new SimplePeer({
      initiator: true,
      stream: localStream!,
      trickle: true,
      config: {
        iceServers: [
          {
            urls: ["stun:hk-turn1.xirsys.com"],
          },
          {
            username:
              "LWj4GKgQ09Z64hXgv-Ykd1n7IwwlNfgfLFApYwQ3aMZeawjHBnfMfrnR1hkM69lJAAAAAGea_a5naWFuY2FybG9jYXJyYW56YQ==",
            credential: "5141889e-dec1-11ef-85f4-0242ac120004",
            urls: [
              "turn:hk-turn1.xirsys.com:80?transport=udp",
              "turn:hk-turn1.xirsys.com:3478?transport=udp",
              "turn:hk-turn1.xirsys.com:80?transport=tcp",
              "turn:hk-turn1.xirsys.com:3478?transport=tcp",
              "turns:hk-turn1.xirsys.com:443?transport=tcp",
              "turns:hk-turn1.xirsys.com:5349?transport=tcp",
            ],
          },
        ],
      },
    });

    newPeer.on("signal", (data) => {
      console.log("Sending offer to target:", targetUserId);
      ws?.send(
        JSON.stringify({
          type: "offer",
          userId,
          target: targetUserId,
          data,
        })
      );
    });

    newPeer.on("stream", (stream) => {
      console.log("Received remote stream");
      setRemoteStream(stream);
      if (remoteAudioRef.current) {
        remoteAudioRef.current.srcObject = stream;
      }
      setIsCallActive(true);
      setStatus(`In a call with ${targetUserId}`);
    });

    newPeer.on("error", (error) => {
      console.error("Peer error:", error);
    });

    newPeer.on("connect", () => {
      console.log("Connected to peer!");
    });

    newPeer.on("icecandidate", (event) => {
      if (event.candidate) {
        console.log("Sending ICE candidate");
        ws?.send(
          JSON.stringify({
            type: "candidate",
            userId,
            target: targetUserId,
            data: event.candidate,
          })
        );
      }
    });

    newPeer.on("close", () => {
      console.log("Call ended");
      setIsCallActive(false);
      setStatus(`Logged in as ${userId}`);
    });

    setPeer(newPeer);
  }
  const handleIncomingCall = useCallback(
    async (data: SignalData) => {
      if (!localStream) {
        await getMedia();
      }

      console.log("Received incoming call from:", data.userId);

      const newPeer = new SimplePeer({
        initiator: false,
        stream: localStream!,
        trickle: true,
        config: {
          iceServers: [
            {
              urls: ["stun:hk-turn1.xirsys.com"],
            },
            {
              username:
                "LWj4GKgQ09Z64hXgv-Ykd1n7IwwlNfgfLFApYwQ3aMZeawjHBnfMfrnR1hkM69lJAAAAAGea_a5naWFuY2FybG9jYXJyYW56YQ==",
              credential: "5141889e-dec1-11ef-85f4-0242ac120004",
              urls: [
                "turn:hk-turn1.xirsys.com:80?transport=udp",
                "turn:hk-turn1.xirsys.com:3478?transport=udp",
                "turn:hk-turn1.xirsys.com:80?transport=tcp",
                "turn:hk-turn1.xirsys.com:3478?transport=tcp",
                "turns:hk-turn1.xirsys.com:443?transport=tcp",
                "turns:hk-turn1.xirsys.com:5349?transport=tcp",
              ],
            },
          ],
        },
      });

      newPeer.on("signal", (signalData) => {
        console.log("Sending answer to:", data.userId);
        ws?.send(
          JSON.stringify({
            type: "answer",
            userId,
            target: data.userId,
            data: signalData,
          })
        );
      });

      newPeer.on("connect", () => {
        console.log("Connected to peer!");
      });

      newPeer.on("icecandidate", (event) => {
        if (event.candidate) {
          console.log("Sending ICE candidate");
          ws?.send(
            JSON.stringify({
              type: "candidate",
              userId,
              target: targetUserId,
              data: event.candidate,
            })
          );
        }
      });

      newPeer.on("stream", (stream) => {
        console.log("Received remote stream");
        setRemoteStream(stream);
        if (remoteAudioRef.current) {
          remoteAudioRef.current.srcObject = stream;
        }
        setIsCallActive(true);
        setStatus(`In a call with ${data.userId}`);
      });

      newPeer.on("error", (error) => {
        console.error("Peer error:", error);
      });

      newPeer.on("close", () => {
        console.log("Call ended");
        setIsCallActive(false);
        setStatus(`Logged in as ${userId}`);
      });

      // Signal the offer to the peer
      newPeer.signal(data.data);
      setPeer(newPeer);
    },
    [localStream, targetUserId, userId, ws]
  );
  function handleLogout() {
    if (ws) {
      ws.close();
      setStatus("Not logged in");
      setIsCallActive(false);
      setPeer(null);
    }
  }

  useEffect(() => {
    const connectWebSocket = () => {
      const websocket = new WebSocket(
        "wss://asg-signaling-server.onrender.com"
      );
      setWs(websocket);

      websocket.onopen = () => {
        console.log("WebSocket connection opened");
        // Re-login if userId exists
        if (userId) {
          websocket.send(JSON.stringify({ type: "login", userId }));
        }
      };

      websocket.onmessage = (message) => {
        const data: SignalData = JSON.parse(message.data);
        console.log("WebSocket message received:", data);

        switch (data.type) {
          case "offer":
            console.log("Received offer from:", data.userId);
            handleIncomingCall(data);
            break;
          case "answer":
            console.log("Received answer from:", data.userId);
            if (peer) {
              peer.signal(data.data);
            }
            break;
          case "candidate":
            console.log("Received ICE candidate from:", data.userId);
            if (peer) {
              peer.signal(data.data);
            }
            break;
          default:
            console.log("Unknown message type:", data.type);
        }
      };

      websocket.onclose = () => {
        console.log("WebSocket connection closed");
        // Attempt to reconnect after a delay
        setTimeout(connectWebSocket, 5000);
      };

      websocket.onerror = (error) => {
        console.error("WebSocket error:", error);
      };
    };

    connectWebSocket();

    return () => {
      if (ws) {
        ws.close();
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId]);
  useEffect(() => {
    getMedia();
    return () => {
      if (localStream) {
        localStream.getTracks().forEach((track) => track.stop());
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  useEffect(() => {
    getMedia();
    return () => {
      if (remoteStream) {
        remoteStream.getTracks().forEach((track) => track.stop());
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  useEffect(() => {
    return () => {
      if (peer) {
        peer.destroy();
      }
      if (ws) {
        ws.close();
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Rest of your JSX remains the same
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-md">
        <h1 className="text-2xl font-bold mb-4 text-center text-black">
          Voice Call Client
        </h1>

        {mediaError && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded mb-4">
            <p>{mediaError}</p>
            <button
              onClick={getMedia}
              className="mt-2 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
            >
              Retry
            </button>
          </div>
        )}

        <div className="mb-4">
          <p className="text-center text-black">
            <span className="font-semibold">Status:</span> {status}
          </p>
        </div>

        <div className="mb-4">
          <input
            type="text"
            placeholder="Your User ID"
            ref={userRef}
            className="w-full p-2 border border-gray-300 rounded mb-2 text-black"
          />
          <div className="flex gap-2">
            <button
              onClick={handleLogin}
              className="w-full bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              Login
            </button>
            <button
              onClick={handleLogout}
              className="w-full bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              Logout
            </button>
          </div>
        </div>

        <div className="mb-4">
          <input
            type="text"
            placeholder="Target User ID"
            value={targetUserId}
            onChange={(e) => setTargetUserId(e.target.value)}
            disabled={isCallActive}
            className="w-full p-2 border border-gray-300 rounded mb-2 text-black"
          />
          <button
            onClick={handleCall}
            disabled={isCallActive}
            className="w-full bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            Call
          </button>
        </div>

        <div className="flex justify-between gap-4">
          <div>
            <h2 className="font-semibold mb-2 text-slate-500">Local Audio</h2>
            <audio
              ref={localAudioRef}
              autoPlay
              muted
              playsInline
              className="w-full"
            />
          </div>
          <div>
            <h2 className="font-semibold mb-2 text-slate-500">Remote Audio</h2>
            <audio
              ref={remoteAudioRef}
              autoPlay
              playsInline
              className="w-full"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default VoicePeer;
