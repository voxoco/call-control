import {
  AnswerRequest,
  BridgeRequest,
  CommandResponse,
  ConferenceRecordingStartRequest,
  ConferenceRecordingStopRequest,
  CreateConferenceRequest,
  CreateConferenceResponse,
  DialParticipantRequest,
  DialRequest,
  DialResponse,
  EnqueueRequest,
  ForkingStartRequest,
  ForkingStopRequest,
  GatherRequest,
  GatherStopRequest,
  GatherUsingAudioRequest,
  GatherUsingSpeakRequest,
  GetFaxResponse,
  GetQueueCallResponse,
  GetQueueResponse,
  HangupRequest,
  HoldParticipantsRequest,
  JoinConferenceRequest,
  LeaveConferenceRequest,
  ListCallsResponse,
  ListConferenceParticipantsRequest,
  ListConferenceParticipantsResponse,
  ListConferencesRequest,
  ListConferencesResponse,
  ListQueueCallsRequest,
  ListQueueCallsResponse,
  MuteParticipantsRequest,
  PauseRecordingRequest,
  PlayAudioParticipantsRequest,
  PlayAudioRequest,
  ReferRequest,
  RejectRequest,
  RemoveFromQueueRequest,
  ResumeRecordingRequest,
  SendDtmfRequest,
  SendFaxRequest,
  SendFaxResponse,
  SpeakTextParticipantsRequest,
  SpeakTextRequest,
  StartRecordingRequest,
  StartStreamRequest,
  StartTranscriptionRequest,
  StopAudioParticipantsRequest,
  StopAudioRequest,
  StopRecordingRequest,
  StopStreamRequest,
  StopTranscriptionRequest,
  TransferRequest,
  UnholdParticipantsRequest,
  UnmuteParticipantsRequest,
  UpdateParticipantsRequest,
  UpdateStateRequest,
} from "./types.ts";

export type Init = {
  baseUrl: string;
  bearerToken: string;
}

export * from "./types.ts";

export class CallControl {
  baseUrl: string;
  bearerToken: string;


  constructor({ baseUrl, bearerToken }: Init) {
    this.baseUrl = baseUrl;
    this.bearerToken = bearerToken;
  }

  // Make Fetch Request
  private async request<TRes>(url: string, config: RequestInit): Promise<TRes> {
    config.headers = {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${this.bearerToken}`,
    };
    config.method = config.method || "POST";

    const res = await fetch(url, config);
    const data = await res.json();

    if (!res.ok) throw new Error(JSON.stringify(data));

    return data.data as TRes;
  }

  /**
   * @description Dial a number or SIP URI from a given connection. A successful response will include a `call_leg_id` which can be used to correlate the command with subsequent webhooks.
   * @param dialRequest - The dial request object.
   * @returns DialResponse
   * @throws {ApiError}
   */
  async dial(dialRequest: DialRequest): Promise<DialResponse> {
    const url = `${this.baseUrl}/calls`;
    const config: RequestInit = {
      body: JSON.stringify(dialRequest),
    };
    return await this.request<DialResponse>(url, config);
  }

  /**
   * @description Answer an incoming call. You must issue this command before executing subsequent commands on an incoming call.
   * @param callControlId - The call control ID of the call to answer.
   * @param AnswerRequest
   * @returns CommandResponse
   * @throws {ApiError}
   */
  async answer(
    callControlId: string,
    answerRequest?: AnswerRequest,
  ): Promise<CommandResponse> {
    const url = `${this.baseUrl}/calls/${callControlId}/actions/answer`;
    const config: RequestInit = {
      body: JSON.stringify(answerRequest),
    };
    return await this.request<CommandResponse>(url, config);
  }

  /**
   * @description Bridge two call control calls.
   * @param callControlId - The call control ID of the call to bridge.
   * @param bridgeRequest
   * @returns CommandResponse
   * @throws {ApiError}
   */
  async bridge(
    callControlId: string,
    bridgeRequest: BridgeRequest,
  ): Promise<CommandResponse> {
    const url = `${this.baseUrl}/calls/${callControlId}/actions/bridge`;
    const config: RequestInit = {
      body: JSON.stringify(bridgeRequest),
    };
    return await this.request<CommandResponse>(url, config);
  }

  /**
   * @description Put the call in a queue.
   * @param callControlId - The call control ID of the call to bridge.
   * @param enqueueRequest
   * @returns CommandResponse
   * @throws {ApiError}
   */
  async enqueue(
    callControlId: string,
    enqueueRequest: EnqueueRequest,
  ): Promise<CommandResponse> {
    const url = `${this.baseUrl}/calls/${callControlId}/actions/enqueue`;
    const config: RequestInit = {
      body: JSON.stringify(enqueueRequest),
    };
    return await this.request<CommandResponse>(url, config);
  }

  /**
   * @description Call forking allows you to stream the media from a call to a specific target in realtime. This stream can be used to enable realtime audio analysis to support a variety of use cases, including fraud detection, or the creation of AI-generated audio responses. Requests must specify either the `target` attribute or the `rx` and `tx` attributes.
   * @param callControlId - The call control ID of the call to fork.
   * @param forkingStartRequest
   * @returns CommandResponse
   * @throws {ApiError}
   */
  async forkingStart(
    callControlId: string,
    forkingStartRequest: ForkingStartRequest,
  ): Promise<CommandResponse> {
    const url = `${this.baseUrl}/calls/${callControlId}/actions/fork_start`;
    const config: RequestInit = {
      body: JSON.stringify(forkingStartRequest),
    };
    return await this.request<CommandResponse>(url, config);
  }

  /**
   * @description Stop forking a call.
   * @param callControlId - The call control ID of the call to stop forking.
   * @param forkingStopRequest
   * @returns CommandResponse
   * @throws {ApiError}
   */
  async forkingStop(
    callControlId: string,
    forkingStopRequest?: ForkingStopRequest,
  ): Promise<CommandResponse> {
    const url = `${this.baseUrl}/calls/${callControlId}/actions/fork_stop`;
    const config: RequestInit = {
      body: JSON.stringify(forkingStopRequest),
    };
    return await this.request<CommandResponse>(url, config);
  }

  /**
   * @description Gather DTMF signals to build interactive menus. You can pass a list of valid digits. The Answer command must be issued before the `gather` command.
   * @param callControlId - The call control ID of the call to gather DTMF from.
   * @param gatherRequest
   * @returns CommandResponse
   * @throws {ApiError}
   */
  async gather(
    callControlId: string,
    gatherRequest?: GatherRequest,
  ): Promise<CommandResponse> {
    const url = `${this.baseUrl}/calls/${callControlId}/actions/gather`;
    const config: RequestInit = {
      body: JSON.stringify(gatherRequest),
    };
    return await this.request<CommandResponse>(url, config);
  }

  /**
   * @description Stop current gather.
   * @param callControlId - The call control ID of the call to stop gathering DTMF from.
   * @param gatherStopRequest
   * @returns CommandResponse
   * @throws {ApiError}
   */
  async gatherStop(
    callControlId: string,
    gatherStopRequest?: GatherStopRequest,
  ): Promise<CommandResponse> {
    const url = `${this.baseUrl}/calls/${callControlId}/actions/gather_stop`;
    const config: RequestInit = {
      body: JSON.stringify(gatherStopRequest),
    };
    return await this.request<CommandResponse>(url, config);
  }

  /**
   * @description Play an audio file on the call until the required DTMF signals are gathered to build interactive menus. You can pass a list of valid digits along with an 'invalid_audio_url', which will be played back at the beginning of each prompt. Playback will be interrupted when a DTMF signal is received. The Answer command must be issued before the `gatherUsingAudio` command.
   * @param callControlId - The call control ID of the call to gather DTMF from.
   * @param gatherUsingAudioRequest
   * @returns CommandResponse
   * @throws {ApiError}
   */
  async gatherUsingAudio(
    callControlId: string,
    gatherUsingAudioRequest?: GatherUsingAudioRequest,
  ): Promise<CommandResponse> {
    const url =
      `${this.baseUrl}/calls/${callControlId}/actions/gather_using_audio`;
    const config: RequestInit = {
      body: JSON.stringify(gatherUsingAudioRequest),
    };
    return await this.request<CommandResponse>(url, config);
  }

  /**
   * @description You can pass a list of valid digits along with an 'invalid_payload', which will be played back at the beginning of each prompt. Speech will be interrupted when a DTMF signal is received. The Answer command must be issued before the `gatherUsingSpeak` command.
   * @param callControlId - The call control ID of the call to gather DTMF from.
   * @param gatherUsingSpeakRequest
   * @returns CommandResponse
   * @throws {ApiError}
   */
  async gatherUsingSpeak(
    callControlId: string,
    gatherUsingSpeakRequest: GatherUsingSpeakRequest,
  ): Promise<CommandResponse> {
    const url =
      `${this.baseUrl}/calls/${callControlId}/actions/gather_using_speak`;
    const config: RequestInit = {
      body: JSON.stringify(gatherUsingSpeakRequest),
    };
    return await this.request<CommandResponse>(url, config);
  }

  /**
   * @description Hang up the call.
   * @param callControlId - The call control ID of the call to hang up.
   * @param hangupRequest
   * @returns CommandResponse
   * @throws {ApiError}
   */
  async hangup(
    callControlId: string,
    hangupRequest?: HangupRequest,
  ): Promise<CommandResponse> {
    const url = `${this.baseUrl}/calls/${callControlId}/actions/hangup`;
    const config: RequestInit = {
      body: JSON.stringify(hangupRequest),
    };
    return await this.request<CommandResponse>(url, config);
  }

  /**
   * @description Removes the call from a queue.
   * @param callControlId - The call control ID of the call to remove from the queue.
   * @param removeFromQueueRequest
   * @returns CommandResponse
   * @throws {ApiError}
   */
  async removeFromQueue(
    callControlId: string,
    removeFromQueueRequest?: RemoveFromQueueRequest,
  ): Promise<CommandResponse> {
    const url = `${this.baseUrl}/calls/${callControlId}/actions/leave_queue`;
    const config: RequestInit = {
      body: JSON.stringify(removeFromQueueRequest),
    };
    return await this.request<CommandResponse>(url, config);
  }

  /**
   * @description Play an audio file on the call. If multiple play audio commands are issued consecutively, the audio files will be placed in a queue awaiting playback.
   * @param callControlId - The call control ID of the call to play audio on.
   * @param playAudioRequest
   * @returns CommandResponse
   * @throws {ApiError}
   */
  async playAudio(
    callControlId: string,
    playAudioRequest: PlayAudioRequest,
  ): Promise<CommandResponse> {
    const url = `${this.baseUrl}/calls/${callControlId}/actions/playback_start`;
    const config: RequestInit = {
      body: JSON.stringify(playAudioRequest),
    };
    return await this.request<CommandResponse>(url, config);
  }

  /**
   * @description Stop audio being played on the call.
   * @param callControlId - The call control ID of the call to stop playing audio on.
   * @param stopAudioRequest
   * @returns CommandResponse
   * @throws {ApiError}
   */
  async stopAudio(
    callControlId: string,
    stopAudioRequest?: StopAudioRequest,
  ): Promise<CommandResponse> {
    const url = `${this.baseUrl}/calls/${callControlId}/actions/playback_stop`;
    const config: RequestInit = {
      body: JSON.stringify(stopAudioRequest),
    };
    return await this.request<CommandResponse>(url, config);
  }

  /**
   * @description Pause recording the call. Recording can be resumed via Resume recording command.
   * @param callControlId - The call control ID of the call to pause recording on.
   * @param pauseRecordingRequest
   * @returns CommandResponse
   * @throws {ApiError}
   */
  async pauseRecording(
    callControlId: string,
    pauseRecordingRequest?: PauseRecordingRequest,
  ): Promise<CommandResponse> {
    const url = `${this.baseUrl}/calls/${callControlId}/actions/record_pause`;
    const config: RequestInit = {
      body: JSON.stringify(pauseRecordingRequest),
    };
    return await this.request<CommandResponse>(url, config);
  }

  /**
   * @description Resume recording the call.
   * @param callControlId - The call control ID of the call to resume recording on.
   * @param resumeRecordingRequest
   * @returns CommandResponse
   * @throws {ApiError}
   */
  async resumeRecording(
    callControlId: string,
    resumeRecordingRequest?: ResumeRecordingRequest,
  ): Promise<CommandResponse> {
    const url = `${this.baseUrl}/calls/${callControlId}/actions/record_resume`;
    const config: RequestInit = {
      body: JSON.stringify(resumeRecordingRequest),
    };
    return await this.request<CommandResponse>(url, config);
  }

  /**
   * @description Start recording the call. Recording will stop on call hang-up, or can be initiated via the Stop Recording command.
   * @param callControlId - The call control ID of the call to start recording.
   * @param startRecordingRequest
   * @returns CommandResponse
   * @throws {ApiError}
   */
  async startRecording(
    callControlId: string,
    startRecordingRequest: StartRecordingRequest,
  ): Promise<CommandResponse> {
    const url = `${this.baseUrl}/calls/${callControlId}/actions/record_start`;
    const config: RequestInit = {
      body: JSON.stringify(startRecordingRequest),
    };
    return await this.request<CommandResponse>(url, config);
  }

  /**
   * @description Stop recording the call.
   * @param callControlId - The call control ID of the call to stop recording.
   * @param stopRecordingRequest
   * @returns CommandResponse
   * @throws {ApiError}
   */
  async stopRecording(
    callControlId: string,
    stopRecordingRequest?: StopRecordingRequest,
  ): Promise<CommandResponse> {
    const url = `${this.baseUrl}/calls/${callControlId}/actions/record_stop`;
    const config: RequestInit = {
      body: JSON.stringify(stopRecordingRequest),
    };
    return await this.request<CommandResponse>(url, config);
  }

  /**
   * @description Initiate a SIP Refer on a Call Control call. You can initiate a SIP Refer at any point in the duration of a call.
   * @param callControlId - The call control ID of the call to initiate a SIP Refer on.
   * @param sipReferRequest
   * @returns CommandResponse
   * @throws {ApiError}
   */
  async refer(
    callControlId: string,
    sipReferRequest: ReferRequest,
  ): Promise<CommandResponse> {
    const url = `${this.baseUrl}/calls/${callControlId}/actions/refer`;
    const config: RequestInit = {
      body: JSON.stringify(sipReferRequest),
    };
    return await this.request<CommandResponse>(url, config);
  }

  /**
   * @description Reject an incoming call.
   * @param callControlId - The call control ID of the call to reject.
   * @param rejectRequest
   * @returns CommandResponse
   * @throws {ApiError}
   */
  async reject(
    callControlId: string,
    rejectRequest: RejectRequest,
  ): Promise<CommandResponse> {
    const url = `${this.baseUrl}/calls/${callControlId}/actions/reject`;
    const config: RequestInit = {
      body: JSON.stringify(rejectRequest),
    };
    return await this.request<CommandResponse>(url, config);
  }

  /**
   * @description Sends DTMF tones from this leg. DTMF tones will be heard by the other end of the call.
   * @param callControlId - The call control ID of the call to send DTMF on.
   * @param SendDtmfRequest
   * @returns CommandResponse
   * @throws {ApiError}
   */
  async sendDtmf(
    callControlId: string,
    sendDTMFRequest: SendDtmfRequest,
  ): Promise<CommandResponse> {
    const url = `${this.baseUrl}/calls/${callControlId}/actions/send_dtmf`;
    const config: RequestInit = {
      body: JSON.stringify(sendDTMFRequest),
    };
    return await this.request<CommandResponse>(url, config);
  }

  /**
   * @description Convert text to speech and play it back on the call. If multiple speak text commands are issued consecutively, the audio files will be placed in a queue awaiting playback.
   * @param callControlId - The call control ID of the call to speak text on.
   * @param speakTextRequest
   * @returns CommandResponse
   * @throws {ApiError}
   */
  async speakText(
    callControlId: string,
    speakTextRequest: SpeakTextRequest,
  ): Promise<CommandResponse> {
    const url = `${this.baseUrl}/calls/${callControlId}/actions/speak`;
    const config: RequestInit = {
      body: JSON.stringify(speakTextRequest),
    };
    return await this.request<CommandResponse>(url, config);
  }

  /**
   * @description Start streaming the media from a call to a specific WebSocket address in near-realtime. Audio will be delivered as base64-encoded RTP payload (raw audio), wrapped in JSON payloads.
   * @param callControlId - The call control ID of the call to start streaming.
   * @param startStreamRequest
   * @returns CommandResponse
   * @throws {ApiError}
   */
  async startStream(
    callControlId: string,
    startStreamRequest?: StartStreamRequest,
  ): Promise<CommandResponse> {
    const url =
      `${this.baseUrl}/calls/${callControlId}/actions/streaming_start`;
    const config: RequestInit = {
      body: JSON.stringify(startStreamRequest),
    };
    return await this.request<CommandResponse>(url, config);
  }

  /**
   * @description Stop streaming a call to a WebSocket.
   * @param callControlId - The call control ID of the call to stop streaming.
   * @param stopStreamRequest
   * @returns CommandResponse
   * @throws {ApiError}
   */
  async stopStream(
    callControlId: string,
    stopStreamRequest?: StopStreamRequest,
  ): Promise<CommandResponse> {
    const url = `${this.baseUrl}/calls/${callControlId}/actions/streaming_stop`;
    const config: RequestInit = {
      body: JSON.stringify(stopStreamRequest),
    };
    return await this.request<CommandResponse>(url, config);
  }

  /**
   * @description Start real-time transcription. Transcription will stop on call hang-up, or can be initiated via the Transcription stop command.
   * @param callControlId - The call control ID of the call to start transcription.
   * @param startTranscriptionRequest
   * @returns CommandResponse
   * @throws {ApiError}
   */
  async startTranscription(
    callControlId: string,
    startTranscriptionRequest?: StartTranscriptionRequest,
  ): Promise<CommandResponse> {
    const url =
      `${this.baseUrl}/calls/${callControlId}/actions/transcription_start`;
    const config: RequestInit = {
      body: JSON.stringify(startTranscriptionRequest),
    };
    return await this.request<CommandResponse>(url, config);
  }

  /**
   * @description Stop real-time transcription.
   * @param callControlId - The call control ID of the call to stop transcription.
   * @param stopTranscriptionRequest
   * @returns CommandResponse
   * @throws {ApiError}
   */
  async stopTranscription(
    callControlId: string,
    stopTranscriptionRequest?: StopTranscriptionRequest,
  ): Promise<CommandResponse> {
    const url =
      `${this.baseUrl}/calls/${callControlId}/actions/transcription_stop`;
    const config: RequestInit = {
      body: JSON.stringify(stopTranscriptionRequest),
    };
    return await this.request<CommandResponse>(url, config);
  }

  /**
   * @description Transfer a call to a new destination. If the transfer is unsuccessful, a `call.hangup` webhook for the other call (Leg B) will be sent indicating that the transfer could not be completed. The original call will remain active and may be issued additional commands, potentially transfering the call to an alternate destination.
   * @param callControlId - The call control ID of the call to transfer.
   * @param transferRequest
   * @returns CommandResponse
   * @throws {ApiError}
   */
  async transfer(
    callControlId: string,
    transferRequest: TransferRequest,
  ): Promise<CommandResponse> {
    const url = `${this.baseUrl}/calls/${callControlId}/actions/transfer`;
    const config: RequestInit = {
      body: JSON.stringify(transferRequest),
    };
    return await this.request<CommandResponse>(url, config);
  }

  /**
   * @description Updates client state
   * @param callControlId - The call control ID of the call to update client state on.
   * @param updateStateRequest
   * @returns CommandResponse
   * @throws {ApiError}
   */
  async updateState(
    callControlId: string,
    updateStateRequest: UpdateStateRequest,
  ): Promise<CommandResponse> {
    const url =
      `${this.baseUrl}/calls/${callControlId}/actions/client_state_update`;
    const config: RequestInit = {
      method: "PUT",
      body: JSON.stringify(updateStateRequest),
    };
    return await this.request<CommandResponse>(url, config);
  }

  /**
   * @description Returns the status of a call (data is available 10 minutes after call ended).
   * @param callControlId - The call control ID of the call to get the status of.
   * @returns CallStatusResponse
   * @throws {ApiError}
   */
  async getCallStatus(callControlId: string): Promise<DialResponse> {
    const url = `${this.baseUrl}/calls/${callControlId}`;
    const config: RequestInit = {
      method: "GET",
    };
    return await this.request<DialResponse>(url, config);
  }

  /**
   * @description Lists all active calls for given connection. Acceptable connections are either SIP connections with webhook_url or xml_request_url, call control or texml. Returned results are cursor paginated.
   * @param connectionId - The connection ID of the connection to list calls for.
   * @returns ListCallsResponse
   * @throws {ApiError}
   */
  async listCalls(connectionId: string): Promise<ListCallsResponse> {
    const url = `${this.baseUrl}/connections/${connectionId}/active_calls`;
    const config: RequestInit = {
      method: "GET",
    };
    return await this.request<ListCallsResponse>(url, config);
  }

  /**
   * @description Lists conferences. Conferences are created on demand, and will expire after all participants have left the conference or after 4 hours regardless of the number of active participants. Conferences are listed in descending order by expires_at.
   * @param ListConferencesRequest
   * @returns ListConferencesResponse
   * @throws {ApiError}
   */
  async listConferences(
    listConferencesRequest?: ListConferencesRequest,
  ): Promise<ListConferencesResponse> {
    let url = `${this.baseUrl}/conferences`;

    if (listConferencesRequest?.filter && listConferencesRequest?.page) {
      url =
        `${url}?filter=${listConferencesRequest.filter}&page=${listConferencesRequest.page}`;
    } else if (listConferencesRequest?.filter) {
      url = `${url}?filter=${listConferencesRequest.filter}`;
    } else if (listConferencesRequest?.page) {
      url = `${url}?page=${listConferencesRequest.page}`;
    }

    const config: RequestInit = {
      method: "GET",
    };
    return await this.request<ListConferencesResponse>(url, config);
  }

  /**
   * @description Create a conference from an existing call leg using a `call_control_id` and a conference name. Upon creating the conference, the call will be automatically bridged to the conference. Conferences will expire after all participants have left the conference or after 4 hours regardless of the number of active participants.
   * @param createConferenceRequest
   * @returns CreateConferenceResponse
   * @throws {ApiError}
   */
  async createConference(
    createConferenceRequest: CreateConferenceRequest,
  ): Promise<CreateConferenceResponse> {
    const url = `${this.baseUrl}/conferences`;
    const config: RequestInit = {
      body: JSON.stringify(createConferenceRequest),
    };
    return await this.request<CreateConferenceResponse>(url, config);
  }

  /**
   * @description Lists conference participants
   * @param conferenceId - The conference ID of the conference to list participants for.
   * @param ListConferenceParticipantsRequest
   * @returns ListConferenceParticipantsResponse
   * @throws {ApiError}
   */
  async listConferenceParticipants(
    conferenceId: string,
    listConferenceParticipantsRequest?: ListConferenceParticipantsRequest,
  ): Promise<ListConferenceParticipantsResponse> {
    let url = `${this.baseUrl}/conferences/${conferenceId}/participants`;

    if (
      listConferenceParticipantsRequest?.filter &&
      listConferenceParticipantsRequest?.page
    ) {
      url =
        `${url}?filter=${listConferenceParticipantsRequest.filter}&page=${listConferenceParticipantsRequest.page}`;
    } else if (listConferenceParticipantsRequest?.filter) {
      url = `${url}?filter=${listConferenceParticipantsRequest.filter}`;
    } else if (listConferenceParticipantsRequest?.page) {
      url = `${url}?page=${listConferenceParticipantsRequest.page}`;
    }

    const config: RequestInit = {
      method: "GET",
    };
    return await this.request<ListConferenceParticipantsResponse>(url, config);
  }

  /**
   * @description Dials a phone number and, when the call is answered, automatically joins them into the specified conference.
   * @param conferenceId - The conference ID of the conference to dial a participant into.
   * @param dialParticipantRequest
   * @returns CommandResponse
   * @throws {ApiError}
   */
  async dialParticipant(
    conferenceId: string,
    dialParticipantRequest: DialParticipantRequest,
  ): Promise<CommandResponse> {
    const url =
      `${this.baseUrl}/conferences/${conferenceId}/actions/dial_participant`;
    const config: RequestInit = {
      body: JSON.stringify(dialParticipantRequest),
    };
    return await this.request<CommandResponse>(url, config);
  }

  /**
   * @description Hold a list of participants in a conference call
   * @param conferenceId - The conference ID of the conference to hold participants in.
   * @param holdParticipantsRequest
   * @returns CommandResponse
   * @throws {ApiError}
   */
  async holdParticipants(
    conferenceId: string,
    holdParticipantsRequest: HoldParticipantsRequest,
  ): Promise<CommandResponse> {
    const url = `${this.baseUrl}/conferences/${conferenceId}/actions/hold`;
    const config: RequestInit = {
      body: JSON.stringify(holdParticipantsRequest),
    };
    return await this.request<CommandResponse>(url, config);
  }

  /**
   * @description Join an existing call leg to a conference. Issue the Join Conference command with the conference ID in the path and the `call_control_id` of the leg you wish to join to the conference as an attribute. The conference can have up to a certain amount of active participants, as set by the `max_participants` parameter in conference creation request.
   * @param conferenceId - The conference ID of the conference to join a call leg to.
   * @param joinConferenceRequest
   * @returns CommandResponse
   * @throws {ApiError}
   */
  async joinConference(
    conferenceId: string,
    joinConferenceRequest: JoinConferenceRequest,
  ): Promise<CommandResponse> {
    const url = `${this.baseUrl}/conferences/${conferenceId}/actions/join`;
    const config: RequestInit = {
      body: JSON.stringify(joinConferenceRequest),
    };
    return await this.request<CommandResponse>(url, config);
  }

  /**
   * @description Removes a call leg from a conference and moves it back to parked state.
   * @param conferenceId - The conference ID of the conference to leave a call leg from.
   * @param leaveConferenceRequest
   * @returns CommandResponse
   * @throws {ApiError}
   */
  async leaveConference(
    conferenceId: string,
    leaveConferenceRequest: LeaveConferenceRequest,
  ): Promise<CommandResponse> {
    const url = `${this.baseUrl}/conferences/${conferenceId}/actions/leave`;
    const config: RequestInit = {
      body: JSON.stringify(leaveConferenceRequest),
    };
    return await this.request<CommandResponse>(url, config);
  }

  /**
   * @description Mute a list of participants in a conference call
   * @param conferenceId - The conference ID of the conference to mute participants in.
   * @param muteParticipantsRequest
   * @returns CommandResponse
   * @throws {ApiError}
   */
  async muteParticipants(
    conferenceId: string,
    muteParticipantsRequest: MuteParticipantsRequest,
  ): Promise<CommandResponse> {
    const url = `${this.baseUrl}/conferences/${conferenceId}/actions/mute`;
    const config: RequestInit = {
      body: JSON.stringify(muteParticipantsRequest),
    };
    return await this.request<CommandResponse>(url, config);
  }

  /**
   * @description Play an audio file to a list of participants in a conference call
   * @param conferenceId - The conference ID of the conference to play audio to participants in.
   * @param playAudioParticipantsRequest
   * @returns CommandResponse
   * @throws {ApiError}
   */
  async playAudioParticipants(
    conferenceId: string,
    playAudioParticipantsRequest: PlayAudioParticipantsRequest,
  ): Promise<CommandResponse> {
    const url = `${this.baseUrl}/conferences/${conferenceId}/actions/play`;
    const config: RequestInit = {
      body: JSON.stringify(playAudioParticipantsRequest),
    };
    return await this.request<CommandResponse>(url, config);
  }

  /**
   * @description Start recording a conference. Recording will stop on conference end, or can be initiated via the Conference Recording Stop command.
   * @param conferenceId - The conference ID of the conference to start recording.
   * @param conferenceRecordingStartRequest
   * @returns CommandResponse
   * @throws {ApiError}
   */
  async conferenceRecordingStart(
    conferenceId: string,
    conferenceRecordingStartRequest: ConferenceRecordingStartRequest,
  ): Promise<CommandResponse> {
    const url =
      `${this.baseUrl}/conferences/${conferenceId}/actions/record_start`;
    const config: RequestInit = {
      body: JSON.stringify(conferenceRecordingStartRequest),
    };
    return await this.request<CommandResponse>(url, config);
  }

  /**
   * @description Stop recording a conference.
   * @param conferenceId - The conference ID of the conference to stop recording.
   * @param conferenceRecordingStopRequest
   * @returns CommandResponse
   * @throws {ApiError}
   */
  async conferenceRecordingStop(
    conferenceId: string,
    conferenceRecordingStopRequest?: ConferenceRecordingStopRequest,
  ): Promise<CommandResponse> {
    const url =
      `${this.baseUrl}/conferences/${conferenceId}/actions/record_stop`;
    const config: RequestInit = {
      body: JSON.stringify(conferenceRecordingStopRequest),
    };
    return await this.request<CommandResponse>(url, config);
  }

  /**
   * @description Convert text to speech and play it to all or some participants.
   * @param conferenceId - The conference ID of the conference to speak text to participants in.
   * @param speakTextParticipantsRequest
   * @returns CommandResponse
   * @throws {ApiError}
   */
  async speakTextParticipants(
    conferenceId: string,
    speakTextParticipantsRequest: SpeakTextParticipantsRequest,
  ): Promise<CommandResponse> {
    const url = `${this.baseUrl}/conferences/${conferenceId}/actions/speak`;
    const config: RequestInit = {
      body: JSON.stringify(speakTextParticipantsRequest),
    };
    return await this.request<CommandResponse>(url, config);
  }

  /**
   * @description Stop playing audio to a list of participants in a conference call
   * @param conferenceId - The conference ID of the conference to stop playing audio to participants in.
   * @param stopAudioParticipantsRequest
   * @returns CommandResponse
   * @throws {ApiError}
   */
  async stopAudioParticipants(
    conferenceId: string,
    stopAudioParticipantsRequest?: StopAudioParticipantsRequest,
  ): Promise<CommandResponse> {
    const url = `${this.baseUrl}/conferences/${conferenceId}/actions/stop`;
    const config: RequestInit = {
      body: JSON.stringify(stopAudioParticipantsRequest),
    };
    return await this.request<CommandResponse>(url, config);
  }

  /**
   * @description Unhold a list of participants in a conference call
   * @param conferenceId - The conference ID of the conference to unhold participants in.
   * @param unholdParticipantsRequest
   * @returns CommandResponse
   * @throws {ApiError}
   */
  async unholdParticipants(
    conferenceId: string,
    unholdParticipantsRequest: UnholdParticipantsRequest,
  ): Promise<CommandResponse> {
    const url = `${this.baseUrl}/conferences/${conferenceId}/actions/unhold`;
    const config: RequestInit = {
      body: JSON.stringify(unholdParticipantsRequest),
    };
    return await this.request<CommandResponse>(url, config);
  }

  /**
   * @description Unmute a list of participants in a conference call
   * @param conferenceId - The conference ID of the conference to unmute participants in.
   * @param unmuteParticipantsRequest
   * @returns CommandResponse
   * @throws {ApiError}
   */
  async unmuteParticipants(
    conferenceId: string,
    unmuteParticipantsRequest: UnmuteParticipantsRequest,
  ): Promise<CommandResponse> {
    const url = `${this.baseUrl}/conferences/${conferenceId}/actions/unmute`;
    const config: RequestInit = {
      body: JSON.stringify(unmuteParticipantsRequest),
    };
    return await this.request<CommandResponse>(url, config);
  }

  /**
   * @description Update conference participants
   * @param conferenceId - The conference ID of the conference to update participants in.
   * @param updateConferenceParticipantsRequest
   * @returns CommandResponse
   * @throws {ApiError}
   */
  async updateConferenceParticipants(
    conferenceId: string,
    updateConferenceParticipantsRequest: UpdateParticipantsRequest,
  ): Promise<CommandResponse> {
    const url = `${this.baseUrl}/conferences/${conferenceId}/actions/update`;
    const config: RequestInit = {
      body: JSON.stringify(updateConferenceParticipantsRequest),
    };
    return await this.request<CommandResponse>(url, config);
  }

  /**
   * @description Retrieve an existing call queue
   * @param queueName - The name of the queue to retrieve.
   * @returns GetQueueResponse
   * @throws {ApiError}
   */
  async getQueue(queueName: string): Promise<GetQueueResponse> {
    const url = `${this.baseUrl}/queues/${queueName}`;
    const config: RequestInit = {
      method: "GET",
    };
    return await this.request<GetQueueResponse>(url, config);
  }

  /**
   * @description Retrieve calls from a queue
   * @param queueName - The name of the queue to retrieve calls from.
   * @param ListQueueCallsRequest
   * @returns ListQueueCallsResponse
   * @throws {ApiError}
   */
  async listQueueCalls(
    queueName: string,
    listQueueCallsRequest?: ListQueueCallsRequest,
  ): Promise<ListQueueCallsResponse> {
    let url = `${this.baseUrl}/queues/${queueName}/calls`;

    if (listQueueCallsRequest?.page) {
      url = `${url}?page=${listQueueCallsRequest.page}`;
    }

    const config: RequestInit = {
      method: "GET",
    };
    return await this.request<ListQueueCallsResponse>(url, config);
  }

  /**
   * @description Get call from a queue
   * @param queueName - The name of the queue to retrieve a call from.
   * @param callControlId - The call control ID of the call to retrieve.
   * @returns GetQueueCallResponse
   * @throws {ApiError}
   */
  async getQueueCall(
    queueName: string,
    callControlId: string,
  ): Promise<GetQueueCallResponse> {
    const url = `${this.baseUrl}/queues/${queueName}/calls/${callControlId}`;
    const config: RequestInit = {
      method: "GET",
    };
    return await this.request<GetQueueCallResponse>(url, config);
  }

  /**
   * @description Send a fax. Files have size limits and page count limit validations. If a file is bigger than 50MB or has more than 350 pages it will fail with `file_size_limit_exceeded` and `page_count_limit_exceeded` respectively.
   * @param sendFaxRequest
   * @returns SendFaxResponse
   * @throws {ApiError}
   */
  async sendFax(sendFaxRequest: SendFaxRequest): Promise<SendFaxResponse> {
    const url = `${this.baseUrl}/faxes`;
    const config: RequestInit = {
      body: JSON.stringify(sendFaxRequest),
    };
    return await this.request<SendFaxResponse>(url, config);
  }

  /**
   * @description Delete a fax
   * @param faxId - The fax ID of the fax to delete.
   * @returns CommandResponse
   * @throws {ApiError}
   */
  async deleteFax(faxId: string): Promise<CommandResponse> {
    const url = `${this.baseUrl}/faxes/${faxId}`;
    const config: RequestInit = {
      method: "DELETE",
    };
    return await this.request<CommandResponse>(url, config);
  }

  /**
   * @description Retrieve a fax
   * @param faxId - The fax ID of the fax to retrieve.
   * @returns GetFaxResponse
   * @throws {ApiError}
   */
  async getFax(faxId: string): Promise<GetFaxResponse> {
    const url = `${this.baseUrl}/faxes/${faxId}`;
    const config: RequestInit = {
      method: "GET",
    };
    return await this.request<GetFaxResponse>(url, config);
  }

  /**
   * @description Cancel a fax. Cancel the outbound fax that is in one of the following states: `queued`, `media.processed`, `originated` or `sending`
   * @param faxId - The fax ID of the fax to cancel.
   * @returns CommandResponse
   * @throws {ApiError}
   */
  async cancelFax(faxId: string): Promise<CommandResponse> {
    const url = `${this.baseUrl}/faxes/${faxId}/actions/cancel`;
    const config: RequestInit = {
      method: "POST",
    };
    return await this.request<CommandResponse>(url, config);
  }

  /**
   * @description Refresh a fax. Refreshes the inbound fax's media_url when it has expired
   * @param faxId - The fax ID of the fax to refresh.
   * @returns CommandResponse
   * @throws {ApiError}
   */
  async refreshFax(faxId: string): Promise<CommandResponse> {
    const url = `${this.baseUrl}/faxes/${faxId}/actions/refresh`;
    const config: RequestInit = {
      method: "POST",
    };
    return await this.request<CommandResponse>(url, config);
  }
}
