"use client";
import React, { FormEvent } from "react";
import Peer from "peerjs";
import { z } from "zod";

type State = {
  stream: MediaStream;
  peer: Peer;
};

export default function VoicePeer() {
  const [state, setState] = React.useState<Partial<State>>();
  const audioRef = React.useRef<HTMLAudioElement>(null);
  const remoteAudioRef = React.useRef<HTMLAudioElement>(null);

  function handleCall(targetPeerID: string) {
    if (!(state?.peer instanceof Peer)) {
      return console.error("Invalid Peer instance.");
    }

    const { peer } = state;

    peer.connect(targetPeerID);
    peer.on("connection", (dataConn) => {
      dataConn.on("open", () => {
        dataConn.on("data", (data) => {
          console.log(data);
          dataConn.send(data);
        });
        dataConn.on("iceStateChanged", (state) => console.log({ state }));
      });

      if (!(state?.stream instanceof MediaStream)) {
        dataConn.close();
        return console.error("Local stream is not a instance of MediaStream");
      }
      const call = peer.call(targetPeerID, state.stream);

      call.on("stream", (remoteStream) => {
        if (remoteAudioRef.current) {
          remoteAudioRef.current.srcObject = remoteStream;
        }
      });
    });
  }

  function answerCall() {
    if (!(state?.peer instanceof Peer)) {
      return console.error("Invalid Peer instance.");
    }
    const { peer } = state;
    peer.on("call", (mediaConn) => {
      if (!(state?.stream instanceof MediaStream)) {
        peer.disconnect();
        return console.error(
          "Local Stream is not a media stream, cannot provide mediaStream to peer."
        );
      }
      mediaConn.answer(state.stream);
      mediaConn.peerConnection.ontrack = (event) => {
        console.log(event);
      };
      mediaConn.on("iceStateChanged", (state) => console.log(state));
      mediaConn.on("stream", (remoteStream) => {
        if (remoteAudioRef.current) {
          remoteAudioRef.current.srcObject = remoteStream;
        }
      });
    });
    peer.on("error", (err) => {
      console.error(err.message);
    });
    peer.on("disconnected", (id) => {
      console.log("Disconnected from initiating Peer: ", id);
    });
  }

  function handleTargetPeerIDSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formdata = new FormData(e.currentTarget);
    const { success, ...rest } = z
      .object({
        targetPeerId: z.string(),
      })
      .safeParse(Object.fromEntries(formdata.entries()));

    if (!success) {
      return console.error(rest.error!.message);
    }

    console.log("Calling ", rest.data!.targetPeerId);
    handleCall(rest.data!.targetPeerId);
  }

  React.useEffect(() => {
    function successful(stream: MediaStream) {
      const peer = new Peer({
        config: {
          iceTransportPolicy: "relay",
          iceServers: [
            {
              urls: "stun:stun.relay.metered.ca:80",
            },
            {
              urls: "turn:global.relay.metered.ca:80",
              username: "657a006614abbc25cc9f5654",
              credential: "0QxzbclOwkE+HgVE",
            },
            {
              urls: "turn:global.relay.metered.ca:80?transport=tcp",
              username: "657a006614abbc25cc9f5654",
              credential: "0QxzbclOwkE+HgVE",
            },
            {
              urls: "turn:global.relay.metered.ca:443",
              username: "657a006614abbc25cc9f5654",
              credential: "0QxzbclOwkE+HgVE",
            },
            {
              urls: "turns:global.relay.metered.ca:443?transport=tcp",
              username: "657a006614abbc25cc9f5654",
              credential: "0QxzbclOwkE+HgVE",
            },
          ],
        },
      });

      peer.on("open", (id) => {
        console.log("My Peer ID: ", id);
      });
      peer.on("error", (err) => {
        console.error(err.message);
      });
      peer.on("disconnected", (id) => {
        console.log("Disconnected Peer: ", id);
      });

      setState({ stream, peer });
      if (audioRef.current) {
        audioRef.current.srcObject = stream;
        // audioRef.current.muted = true;
      }
    }
    function handleError(err: Error) {
      console.error(err.message);
    }

    navigator.mediaDevices
      .getUserMedia({
        audio: true,
        video: false,
      })
      .then(successful)
      .catch(handleError);

    return () => {
      state?.peer?.destroy();
    };
  }, []); // eslint-disable-line

  console.log(state);

  return (
    <div>
      <h1>VoicePeer</h1>
      <form onSubmit={handleTargetPeerIDSubmit}>
        <input
          type="text"
          name="targetPeerId"
          placeholder="Target Peer ID"
          className="text-black"
          required
        />
        <button type="submit">Call</button>
      </form>
      <button onClick={() => answerCall()}>Answer</button>
      <audio ref={audioRef} autoPlay />
      <audio ref={remoteAudioRef} autoPlay />
    </div>
  );
}
