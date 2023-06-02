# TypeScript SDK for Call Control

This is a Deno TypeScript SDK for Call Control, providing an easy way to
interact with the Call Control API. The SDK includes methods to manage calls,
perform actions like dialing, answering, and hanging up, as well as working with
DTMF tones, real-time transcription, and media streaming.

## Table of Contents

- [Getting Started](#getting-started)
- [Usage](#usage)
- [Available Methods](#available-methods)

## Getting Started

To use this SDK, you'll need to import the `CallControl` class into your project
and instantiate it with your `baseUrl` and `bearerToken`.

```typescript
import { CallControl, DialResponse } from "https://deno.land/x/voxo_call_control@v1.0.1/mod.ts";

const cc = new CallControl({
  baseUrl: "https://your-api-url.com",
  bearerToken : "your-bearer-token"
});
```

## Usage

After initializing the `CallControl` class, you can call its methods to interact
with the Call Control API. For example, to dial a number:

```typescript
try {
  const call = await cc.dial({
    to: "+10409992842",
    from: "+12994882747",
    connection_id: "2299939939jfjj93",
  });
} catch (err) {
  console.log(err.message);
}
```

## Available Methods

The following methods are available in the CallControl class:

### 1. dial(dialRequest: DialRequest)

Dials a number or SIP URI from a given connection. Returns a `DialResponse` with
a `call_leg_id` that can be used to correlate the command with subsequent
webhooks.

### 2. answer(callControlId: string, answerRequest?: AnswerRequest)

Answers an incoming call. The Answer command must be issued before executing
subsequent commands on an incoming call. Returns a `CommandResponse`.

### 3. bridge(callControlId: string, bridgeRequest: BridgeRequest)

Bridges two call control calls. Returns a `CommandResponse`.

### 4. enqueue(callControlId: string, enqueueRequest: EnqueueRequest)

Puts the call in a queue. Returns a `CommandResponse`.

### 5. forkingStart(callControlId: string, forkingStartRequest: ForkingStartRequest)

Starts forking the media from a call to a specific target in realtime. This
stream can be used to enable real-time audio analysis for a variety of use
cases, such as fraud detection or AI-generated audio responses. Returns a
`CommandResponse`.

### 6. forkingStop(callControlId: string, forkingStopRequest?: ForkingStopRequest)

Stops forking a call. Returns a `CommandResponse`.

### 7. gather(callControlId: string, gatherRequest?: GatherRequest)

Gathers DTMF signals to build interactive menus. The Answer command must be
issued before the `gather` command. Returns a `CommandResponse`.

### 8. gatherStop(callControlId: string, gatherStopRequest?: GatherStopRequest)

Stops the current gather. Returns a `CommandResponse`.

### 9. gatherUsingAudio(callControlId: string, gatherUsingAudioRequest?: GatherUsingAudioRequest)

Plays an audio file on the call until the required DTMF signals are gathered to
build interactive menus. The Answer command must be issued before the
`gatherUsingAudio` command. Returns a `CommandResponse`.

### 10. gatherUsingSpeak(callControlId: string, gatherUsingSpeakRequest: GatherUsingSpeakRequest)

Converts text to speech and plays it back on the call to gather DTMF signals.
The Answer command must be issued before the `gatherUsingSpeak` command. Returns
a `CommandResponse`.

### 11. hangup(callControlId: string, hangupRequest?: HangupRequest)

Hangs up the call. Returns a `CommandResponse`.

### 12. removeFromQueue(callControlId: string, removeFromQueueRequest?: RemoveFromQueueRequest)

Removes the call from a queue. Returns a `CommandResponse`.

### 13. playAudio(callControlId: string, playAudioRequest: PlayAudioRequest)

Plays an audio file on the call. If multiple play audio commands are issued
consecutively, the audio files will be placed in a queue awaiting playback.
Returns a `CommandResponse`.

### 14. stopAudio(callControlId: string, stopAudioRequest?: StopAudioRequest)

Stops audio being played on the call. Returns a `CommandResponse`.

### 15. pauseRecording(callControlId: string, pauseRecordingRequest?: PauseRecordingRequest)

Pauses recording the call. Recording can be resumed via the Resume recording
command. Returns a `CommandResponse`.

### 16. resumeRecording(callControlId: string, resumeRecordingRequest?: ResumeRecordingRequest)

Resumes recording the call. Returns a `CommandResponse`.

### 17. startRecording(callControlId: string, startRecordingRequest: StartRecordingRequest)

Starts recording the call. Recording will stop on call hang-up or can be
initiated via the Stop Recording command. Returns a `CommandResponse`.

### 18. stopRecording(callControlId: string, stopRecordingRequest?: StopRecordingRequest)

Stops recording the call. Returns a `CommandResponse`.

### 19. refer(callControlId: string, sipReferRequest: ReferRequest)

Initiates a SIP Refer on a Call Control call. Returns a `CommandResponse`.

### 20. reject(callControlId: string, rejectRequest: RejectRequest)

Rejects an incoming call. Returns a `CommandResponse`.

### 21. sendDtmf(callControlId: string, sendDTMFRequest: SendDtmfRequest)

Sends DTMF tones from this leg. DTMF tones will be heard by the other end of the
call. Returns a `CommandResponse`.

### 22. speakText(callControlId: string, speakTextRequest: SpeakTextRequest)

Converts text to speech and plays it back on the call. If multiple speak text
commands are issued consecutively, the audio files will be placed in a queue
awaiting playback. Returns a `CommandResponse`.

### 23. startStream(callControlId: string, startStreamRequest?: StartStreamRequest)

Starts streaming the media from a call to a specific WebSocket address in
near-realtime. Audio will be delivered as base64-encoded RTP payload (raw
audio), wrapped in JSON payloads. Returns a `CommandResponse`.

### 24. stopStream(callControlId: string, stopStreamRequest?: StopStreamRequest)

Stops streaming a call to a WebSocket. Returns a `CommandResponse`.

### 25. startTranscription(callControlId: string, startTranscriptionRequest?: StartTranscriptionRequest)

Starts real-time transcription. Transcription will stop on call hang-up or can
be initiated via the Transcription stop command. Returns a `CommandResponse`.

### 26. stopTranscription(callControlId: string, stopTranscriptionRequest?: StopTranscriptionRequest)

Stops real-time transcription. Returns a `CommandResponse`.

### 27. transfer(callControlId: string, transferRequest: TransferRequest)

Transfers a call to a new destination. If the transfer is unsuccessful, a
`call.hangup` webhook for the other call (Leg B) will be sent indicating that
the transfer could not be completed. The original call will remain active and
may be issued additional commands, potentially transferring the call to an
alternate destination. Returns a `CommandResponse`.

### 28. updateState(callControlId: string, updateStateRequest: UpdateStateRequest)

Updates client state. Returns a `CommandResponse`.

For each method, refer to the SDK's `types.ts` for more details on the required
parameters and expected responses.
