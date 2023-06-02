export type Meta = {
  /**
   * Pagination object
   * @example { "total_pages": 1, "total_results": 1, "page_number": 1, "page_size": 20 }
   */

  /**
   * Total number of pages
   * @example 1
   */
  total_pages: number;

  /**
   * Total number of results
   * @example 1
   */
  total_results: number;

  /**
   * Current page number
   * @example 1
   */
  page_number: number;

  /**
   * Number of results per page
   * @example 20
   */
  page_size: number;
};

export type UnexpectedError = {
  /**
   * Error code
   * @example 10007
   */
  code: string;

  /**
   * Error title
   * @example "Unexpected error"
   */
  title: string;

  /**
   * Error detail
   * @example "An unexpected error occurred."
   */
  detail: string;

  /**
   * Meta object containing additional information
   */
  meta: {
    /**
     * URL containing more information about the error
     */
    url: string;
  };
};

export type CommandResult = {
  result: "ok";
};

export type DialogflowConfig = {
  /**
   * Enables sentiment analysis for Dialogflow.
   * @default false
   * @example true
   */
  analyze_sentiment?: boolean;

  /**
   * Enables partial automated agent replies for Dialogflow.
   * @default false
   * @example true
   */
  partial_automated_agent_reply?: boolean;
};

export type AnsweringMachineDetectionConfig = {
  /**
   * Maximum timeout threshold for overall detection.
   * @default 3500
   * @example 5000
   */
  total_analysis_time_millis?: number;

  /**
   * Silence duration threshold after a greeting message or voice for it be considered human.
   * @default 800
   * @example 1000
   */
  after_greeting_silence_millis?: number;

  /**
   * Maximum threshold for silence between words.
   * @default 50
   * @example 100
   */
  between_words_silence_millis?: number;

  /**
   * Maximum threshold of a human greeting. If greeting longer than this value, considered machine.
   * @default 3500
   * @example 1500
   */
  greeting_duration_millis?: number;

  /**
   * If initial silence duration is greater than this value, consider it a machine.
   * @default 3500
   * @example 1800
   */
  initial_silence_millis?: number;

  /**
   * If number of detected words is greater than this value, consder it a machine.
   * @default 5
   * @example 3
   */
  maximum_number_of_words?: number;

  /**
   * If a single word lasts longer than this threshold, consider it a machine.
   * @default 3500
   * @example 2000
   */
  maximum_word_length_millis?: number;

  /**
   * Minimum noise threshold for any analysis.
   * @default 256
   * @example 512
   */
  silence_threshold?: number;

  /**
   * If machine already detected, maximum timeout threshold to determine the end of the machine greeting.
   * @default 5000
   * @example 7500
   */
  greeting_total_analysis_time_millis?: number;

  /**
   * If machine already detected, maximum threshold for silence between words. If exceeded, the greeting is considered ended.
   * @default 1500
   * @example 2000
   */
  greeting_silence_duration_millis?: number;
};

export type DialRequest = {
  /**
   * The DID or SIP URI to dial out to. Multiple DID or SIP URIs can be provided using an array of strings
   * @example "+18005550100 or sip:username@sip.voxo.co"
   * @example ["+18005550100", "sip:username@sip.voxo.co"]
   */
  to: string | string[];

  /**
   * The `from` number to be used as the caller id presented to the destination (`to` number). The number should be in +E164 format.
   * @example "+18005550101"
   */
  from: string;

  /**
   * The `from_display_name` string to be used as the caller id name (SIP From Display Name) presented to the destination (`to` number). The string should have a maximum of 128 characters, containing only letters, numbers, spaces, and -_~!.+ special characters. If ommited, the display name will be the same as the number in the `from` field.
   * @example "Company Name"
   */
  from_display_name?: string;

  /**
   * The ID of the Call Control App (formerly ID of the connection) to be used when dialing the destination.
   */
  connection_id: string;

  /**
   * The URL of a file to be played back to the callee when the call is answered. The URL can point to either a WAV or MP3 file. media_name and audio_url cannot be used together in one request.
   * @example "http://example.com/message.wav"
   */
  audio_url?: string;

  /**
   * The media_name of a file to be played back to the callee when the call is answered. The media_name must point to a file previously uploaded to api.voxo.com/v2/media by the same user/organization. The file must either be a WAV or MP3 file.
   * @example "my_media_uploaded_to_media_storage_api"
   */
  media_name?: string;

  /**
   * The list of comma-separated codecs in a preferred order for the forked media to be received.
   * @example "G722,PCMU,PCMA,G729,OPUS,VP8,H264"
   */
  preferred_codecs?: string;

  /**
   * The number of seconds that VOXO will wait for the call to be answered by the destination to which it is being called. If the timeout is reached before an answer is received, the call will hangup and a `call.hangup` webhook with a `hangup_cause` of `timeout` will be sent. Minimum value is 5 seconds. Maximum value is 120 seconds.
   * @default 30
   * @example 60
   */
  timeout_secs?: number;

  /**
   * Sets the maximum duration of a Call Control Leg in seconds. If the time limit is reached, the call will hangup and a `call.hangup` webhook with a `hangup_cause` of `time_limit` will be sent. For example, by setting a time limit of 120 seconds, a Call Leg will be automatically terminated two minutes after being answered. The default time limit is 14400 seconds or 4 hours and this is also the maximum allowed call length.
   * @default 14400
   * @example 600
   */
  time_limit_secs?: number;

  /**
   * Enables Answering Machine Detection. VOXO offers Premium and Standard detections. With Premium detection, when a call is answered, VOXO runs real-time detection and sends a `call.machine.premium.detection.ended` webhook with one of the following results: `human_residence`, `human_business`, `machine`, `silence` or `fax_detected`. If we detect a beep, we also send a `call.machine.premium.greeting.ended` webhook with the result of `beep_detected`. If we detect a beep before `call.machine.premium.detection.ended` we only send `call.machine.premium.greeting.ended`, and if we detect a beep after `call.machine.premium.detection.ended`, we send both webhooks. With Standard detection, when a call is answered, VOXO runs real-time detection to determine if it was picked up by a human or a machine and sends an `call.machine.detection.ended` webhook with the analysis result. If `greeting_end` or `detect_words` is used and a `machine` is detected, you will receive another `call.machine.greeting.ended` webhook when the answering machine greeting ends with a beep or silence. If `detect_beep` is used, you will only receive `call.machine.greeting.ended` if a beep is detected.
   * @default "disabled"
   */
  answering_machine_detection?:
    | "premium"
    | "detect"
    | "detect_beep"
    | "detect_words"
    | "greeting_end"
    | "disabled";

  /**
   * Optional configuration parameters to modify 'answering_machine_detection' performance.
   */
  answering_machine_detection_config?: AnsweringMachineDetectionConfig;

  /**
   * Custom headers to be added to the SIP INVITE.
   * @example [
   *   {
   *     "name": "head_1",
   *     "value": "val_1"
   *   },
   *   {
   *     "name": "head_2",
   *     "value": "val_2"
   *   }
   * ]
   */
  custom_headers?: Array<{
    name: string;
    value: string;
  }>;

  /**
   * Use this field to set the Billing Group ID for the call. Must be a valid and existing Billing Group ID.
   * @example "f5586561-8ff0-4291-a0ac-84fe544797bd"
   */
  billing_group_id?: string;

  /**
   * Use this field to add state to every subsequent webhook. It must be a valid Base-64 encoded string.
   * @example "aGF2ZSBhIG5pY2UgZGF5ID1d"
   */
  client_state?: string;

  /**
   * Use this field to avoid duplicate commands. VOXO will ignore others Dial commands with the same `command_id`.
   * @example "891510ac-f3e4-11e8-af5b-de00688a4901"
   */
  command_id?: string;

  /**
   * Use another call's control id for sharing the same call session id
   * @example "ilditnZK_eVysupV21KzmzN_sM29ygfauQojpm4BgFtfX5hXAcjotg=="
   */
  link_to?: string;

  /**
   * SIP Authentication username used for SIP challenges.
   */
  sip_auth_username?: string;

  /**
   * SIP Authentication password used for SIP challenges.
   */
  sip_auth_password?: string;

  /**
   * SIP headers to be added to the SIP INVITE request. Currently only User-to-User header is supported.
   * @example [
   *   {
   *     "name": "User-to-User",
   *     "value": "12345"
   *   }
   * ]
   */
  sip_headers?: Array<{
    name: string;
    value: string;
  }>;

  /**
   * Sound modifications object
   */
  sound_modifications?: SoundModifications;

  /**
   * The destination WebSocket address where the stream is going to be delivered.
   * @example "wss://www.example.com/websocket"
   */
  stream_url?: string;

  /**
   * Specifies which track should be streamed.
   * @default "inbound_track"
   * @example "both_tracks"
   */
  stream_track?: "inbound_track" | "outbound_track" | "both_tracks";

  /**
   * Generate silence RTP packets when no transmission available.
   * @default false
   * @example true
   */
  send_silence_when_idle?: boolean;

  /**
   * Use this field to override the URL for which VOXO will send subsequent webhooks to for this call.
   * @example "https://www.example.com/server-b/"
   */
  webhook_url?: string;

  /**
   * HTTP request export type used for `webhook_url`.
   * @default "POST"
   * @example "GET"
   */
  webhook_url_method?: "POST" | "GET";

  /**
   * Start recording automatically after an event. Disabled by default.
   * @example "record-from-answer"
   */
  record?: "record-from-answer";

  /**
   * Defines which channel should be recorded ('single' or 'dual') when `record` is specified.
   * @default "dual"
   * @example "single"
   */
  record_channels?: "single" | "dual";

  /**
   * Defines the format of the recording ('wav' or 'mp3') when `record` is specified.
   * @default "mp3"
   * example "wav"
   */
  record_format?: "wav" | "mp3";

  /**
   * Defines the maximum length for the recording in seconds when `record` is specified. The minimum value is 0. The maximum value is 43200. The default value is 0 (infinite).
   * @default 0
   * @example 1000
   */
  record_max_length?: number;

  /**
   * The number of seconds that VOXO will wait for the recording to be stopped if silence is detected when `record` is specified. The timer only starts when the speech is detected. The minimum value is 0. The default value is 0 (infinite).
   * @default 0
   * @example 100
   */
  record_timeout_secs?: number;

  /**
   * Enables Dialogflow for the current call. The default value is false.
   * @default false
   * @example true
   */
  enable_dialogflow?: boolean;

  /**
   * Dialogflow configuration object
   */
  dialogflow_config?: DialogflowConfig;
};

export interface DialResponse extends Call {
  /**
   * Indicates whether the call is alive or not. For Dial command it will always be `false` (dialing is asynchronous).
   * @example true
   */
  is_alive: boolean;
}

export type CustomSipHeader = {
  name: string;
  value: string;
};

export type SipHeader = {
  name: string;
  value: string;
};

export type SoundModifications = {
  /**
   * Set the pitch directly, value should be > 0, default 1 (lower = lower tone)
   */
  pitch?: number;
  /**
   * Adjust the pitch in semitones, values should be between -14 and 14, default 0
   */
  semitone?: number;
  /**
   * Adjust the pitch in octaves, values should be between -1 and 1, default 0
   */
  octaves?: number;
  /**
   * The track to which the sound modifications will be applied. Accepted values are `inbound` or `outbound`
   */
  track?: string;
};

export type AnswerRequest = {
  /**
   * Use this field to set the Billing Group ID for the call. Must be a valid and existing Billing Group ID.
   * @example "f5586561-8ff0-4291-a0ac-84fe544797bd"
   */
  billing_group_id?: string;

  /**
   * Use this field to add state to every subsequent webhook. It must be a valid Base-64 encoded string.
   * @example "aGF2ZSBhIG5pY2UgZGF5ID1d"
   */
  client_state?: string;

  /**
   * Use this field to avoid duplicate commands. VOXO will ignore any command with the same `command_id` for the same `call_control_id`.
   * @example "891510ac-f3e4-11e8-af5b-de00688a4901"
   */
  command_id?: string;

  /**
   * Custom headers to be added to the SIP INVITE response.
   * @example [ { name: "head_1", value: "val_1" }, { name: "head_2", value: "val_2" }]
   */
  custom_headers?: CustomSipHeader[];

  /**
   * SIP headers to be added to the SIP INVITE response. Currently only User-to-User header is supported.
   * @example [ { name: "User-to-User", value: "value" }]
   */
  sip_headers?: SipHeader[];

  /**
   * Sound modifications for the answer request.
   */
  sound_modifications?: SoundModifications;

  /**
   * The destination WebSocket address where the stream is going to be delivered.
   * @example "wss://www.example.com/websocket"
   */
  stream_url?: string;

  /**
   * Specifies which track should be streamed.
   * @default "inbound_track"
   * @example "both_tracks"
   */
  stream_track?: "inbound_track" | "outbound_track" | "both_tracks";

  /**
   * Generate silence RTP packets when no transmission available.
   * @default false
   * @example true
   */
  send_silence_when_idle?: boolean;

  /**
   * Use this field to override the URL for which VOXO will send subsequent webhooks to for this call.
   * @example "https://www.example.com/server-b/"
   */
  webhook_url?: string;

  /**
   * HTTP request export type used for `webhook_url`.
   * @default "POST"
   * @example "GET"
   */
  webhook_url_method?: "POST" | "GET";
};

export type CommandResponse = {
  result: "ok";
};

export type BridgeRequest = {
  /**
   * The Call Control ID of the call you want to bridge with.
   */
  call_control_id: string;

  /**
   * Use this field to add state to every subsequent webhook. It must be a valid Base-64 encoded string.
   */
  client_state?: string;

  /**
   * Use this field to avoid duplicate commands. VOXO will ignore any command with the same `command_id` for the same `call_control_id`.
   */
  command_id?: string;

  /**
   * Specifies behavior after the bridge ends (i.e. the opposite leg either hangs up or is transferred). If supplied with the value self, the current leg will be parked after unbridge. If not set, the default behavior is to hang up the leg.
   */
  park_after_unbridge?: string;

  /**
   * The name of the queue you want to bridge with, can't be used together with call_control_id parameter. Bridging with a queue means bridging with the first call in the queue. The call will always be removed from the queue regardless of whether bridging succeeds. Returns an error when the queue is empty.
   */
  queue?: string;
};

export type EnqueueRequest = {
  /**
   * Use this field to add state to every subsequent webhook. It must be a valid Base-64 encoded string.
   */
  client_state?: string;

  /**
   * Use this field to avoid duplicate commands. VOXO will ignore any command with the same command_id for the same call_control_id.
   */
  command_id?: string;

  /**
   * The maximum number of calls allowed in the queue at a given time. Can't be modified for an existing queue.
   * @default 100
   */
  max_size?: number;

  /**
   * The number of seconds after which the call will be removed from the queue.
   */
  max_wait_time_secs?: number;

  /**
   * The name of the queue the call should be put in. If a queue with a given name doesn't exist yet it will be created.
   */
  queue_name: string;
};

export type ForkingStartRequest = {
  /**
   * A valid Base-64 encoded string to add state to every subsequent webhook.
   * @example "c2FtcGxlIHN0YXRl"
   */
  client_state?: string;

  /**
   * A unique identifier to avoid duplicate commands. VOXO will ignore any command with the same command_id for the same call_control_id.
   * @example "unique-command-id"
   */
  command_id?: string;

  /**
   * The network target, udp:ip_address:port, where the call's incoming RTP media packets should be forwarded.
   * @example "udp:192.168.1.1:1234"
   */
  rx: string;

  /**
   * Optionally specify a media export type to stream. If decrypted selected, VOXO will decrypt incoming SIP media before forking to the target.
   * rx and tx are required fields if decrypted selected.
   * @default "raw"
   * @enum "raw" "decrypted"
   * @example "raw"
   */
  stream_type?: "raw" | "decrypted";

  /**
   * The network target, udp:ip_address:port, where the call's RTP media packets should be forwarded.
   * Both incoming and outgoing media packets will be delivered to the specified target, and information about the stream will be included in the encapsulation protocol header, including the direction (0 = inbound; 1 = outbound), leg (0 = A-leg; 1 = B-leg), and call_leg_id.
   * @example "udp:192.168.1.1:2345"
   */
  target: string;

  /**
   * The network target, udp:ip_address:port, where the call's outgoing RTP media packets should be forwarded.
   * @example "udp:192.168.1.1:3456"
   */
  tx: string;
};

export type ForkingStopRequest = {
  /**
   * Use this field to add state to every subsequent webhook. It must be a valid Base-64 encoded string.
   */
  client_state?: string;

  /**
   * Use this field to avoid duplicate commands. VOXO will ignore any command with the same command_id for the same call_control_id.
   */
  command_id?: string;

  /**
   * Optionally specify a stream_type. This should match the stream_export type that was used in fork_start command to properly stop the fork.
   * @default "raw"
   * @enum "raw" | "decrypted"
   */
  stream_type?: "raw" | "decrypted";
};

export type GatherRequest = {
  /**
   * A Base-64 encoded string to add state to every subsequent webhook.
   */
  client_state?: string;

  /**
   * A unique identifier for the command to avoid duplicate commands.
   * VOXO will ignore any command with the same command_id for the same call_control_id.
   */
  command_id?: string;

  /**
   * The number of milliseconds to wait for the first DTMF.
   * @default 5000
   */
  initial_timeout_millis?: number;

  /**
   * The number of milliseconds to wait for input between digits.
   * @default 5000
   */
  inter_digit_timeout_millis?: number;

  /**
   * The maximum number of digits to fetch.
   * This parameter has a maximum value of 128.
   * @default 128
   */
  maximum_digits?: number;

  /**
   * The minimum number of digits to fetch.
   * This parameter has a minimum value of 1.
   * @default 1
   */
  minimum_digits?: number;

  /**
   * The digit used to terminate input if fewer than maximum_digits digits have been gathered.
   * @default "#"
   */
  terminating_digit?: string;

  /**
   * The number of milliseconds to wait to complete the request.
   * @default 60000
   */
  timeout_millis?: number;

  /**
   * A list of all digits accepted as valid.
   * @default "0123456789#*"
   */
  valid_digits?: string;
};

export type GatherStopRequest = {
  /**
   * A valid Base-64 encoded string used to add state to every subsequent webhook.
   * @example "U3RhdGUgRXhhbXBsZQ=="
   */
  client_state?: string;

  /**
   * A unique identifier to avoid duplicate commands. VOXO will ignore any command with the same command_id for the same call_control_id.
   * @example "cmd_12345"
   */
  command_id?: string;
};

export type GatherUsingAudioRequest = {
  /**
   * The URL of a file to be played back at the beginning of each prompt. The URL can point to either a WAV or MP3 file. media_name and audio_url cannot be used together in one request.
   */
  audio_url?: string;

  /**
   * Use this field to add state to every subsequent webhook. It must be a valid Base-64 encoded string.
   */
  client_state?: string;

  /**
   * Use this field to avoid duplicate commands. VOXO will ignore any command with the same command_id for the same call_control_id.
   */
  command_id?: string;

  /**
   * The number of milliseconds to wait for input between digits.
   * @default 5000
   */
  inter_digit_timeout_millis?: number;

  /**
   * The URL of a file to play when digits don't match the valid_digits parameter or the number of digits is not between min and max. The URL can point to either a WAV or MP3 file. invalid_media_name and invalid_audio_url cannot be used together in one request.
   */
  invalid_audio_url?: string;

  /**
   * The media_name of a file to be played back when digits don't match the valid_digits parameter or the number of digits is not between min and max. The media_name must point to a file previously uploaded to api.VOXO.com/v2/media by the same user/organization. The file must either be a WAV or MP3 file.
   */
  invalid_media_name?: string;

  /**
   * The maximum number of digits to fetch. This parameter has a maximum value of 128.
   * @default 128
   */
  maximum_digits?: number;

  /**
   * The maximum number of times the file should be played if there is no input from the user on the call.
   * @default 3
   */
  maximum_tries?: number;

  /**
   * The media_name of a file to be played back at the beginning of each prompt. The media_name must point to a file previously uploaded to api.VOXO.com/v2/media by the same user/organization. The file must either be a WAV or MP3 file.
   */
  media_name?: string;

  /**
   * The minimum number of digits to fetch. This parameter has a minimum value of 1.
   * @default 1
   */
  minimum_digits?: number;

  /**
   * The digit used to terminate input if fewer than maximum_digits digits have been gathered.
   * @default "#"
   */
  terminating_digit?: string;

  /**
   * The number of milliseconds to wait for a DTMF response after file playback ends before a replaying the sound file.
   * @default 60000
   */
  timeout_millis?: number;

  /**
   * A list of all digits accepted as valid.
   * @default "0123456789#*"
   */
  valid_digits?: string;
};

export type GatherUsingSpeakRequest = {
  /**
   * A valid Base-64 encoded string to add state to every subsequent webhook.
   */
  client_state?: string;

  /**
   * A string to avoid duplicate commands. VOXO will ignore any command with the same command_id for the same call_control_id.
   */
  command_id?: string;

  /**
   * @default 5000
   * The number of milliseconds to wait for input between digits.
   */
  inter_digit_timeout_millis?: number;

  /**
   * The text or SSML to be converted into speech when digits don't match the valid_digits parameter or the number of digits is not between min and max. There is a 3,000 character limit.
   */
  invalid_payload?: string;

  /**
   * @required
   * @enum "arb" "cmn-CN" "cy-GB" "da-DK" "de-DE" "en-AU" "en-GB" "en-GB-WLS" "en-IN" "en-US" "es-ES" "es-MX" "es-US" "fr-CA" "fr-FR" "hi-IN" "is-IS" "it-IT" "ja-JP" "ko-KR" "nb-NO" "nl-NL" "pl-PL" "pt-BR" "pt-PT" "ro-RO" "ru-RU" "sv-SE" "tr-TR"
   * The language you want spoken.
   */
  language: string;

  /**
   * @default 128
   * The maximum number of digits to fetch. This parameter has a maximum value of 128.
   */
  maximum_digits?: number;

  /**
   * @default 3
   * The maximum number of times that a file should be played back if there is no input from the user on the call.
   */
  maximum_tries?: number;

  /**
   * @default 1
   * The minimum number of digits to fetch. This parameter has a minimum value of 1.
   */
  minimum_digits?: number;

  /**
   * @required
   * The text or SSML to be converted into speech. There is a 3,000 character limit.
   */
  payload: string;

  /**
   * @default "text"
   * @enum "text" "ssml"
   * The export type of the provided payload. The payload can either be plain text, or Speech Synthesis Markup Language (SSML).
   */
  payload_type?: string;

  /**
   * @default "premium"
   * @enum "basic" "premium"
   * This parameter impacts speech quality, language options and payload types. When using basic, only the en-US language and payload export type text are allowed.
   */
  service_level?: string;

  /**
   * @default "#"
   * The digit used to terminate input if fewer than maximum_digits digits have been gathered.
   */
  terminating_digit?: string;

  /**
   * @default 60000
   * The number of milliseconds to wait for a DTMF response after speak ends before a replaying the sound file.
   */
  timeout_millis?: number;

  /**
   * @default "0123456789#*"
   * A list of all digits accepted as valid.
   */
  valid_digits?: string;

  /**
   * @required
   * @enum "male" "female"
   * The gender of the voice used to speak back the text.
   */
  voice: string;
};

export type HangupRequest = {
  /**
   * Use this field to add state to every subsequent webhook.
   * It must be a valid Base-64 encoded string.
   * @example "Y2xpZW50X3N0YXRlX2V4YW1wbGU="
   */
  client_state: string;

  /**
   * Use this field to avoid duplicate commands. VOXO will ignore any
   * command with the same command_id for the same call_control_id.
   * @example "command-1234"
   */
  command_id: string;
};

export type RemoveFromQueueRequest = {
  /**
   * The unique identifier for the call.
   */
  call_control_id: string;

  /**
   * Removes the call from the queue, the call currently is enqueued in.
   * @default ""
   */
  client_state?: string;

  /**
   * Use this field to add state to every subsequent webhook. It must be a valid Base-64 encoded string.
   * @example "c2FtcGxlX3N0YXRl"
   */
  command_id?: string;
};

export type PlayAudioRequest = {
  /**
   * The URL of a file to be played back on the call. The URL can point to either a WAV or MP3 file.
   * media_name and audio_url cannot be used together in one request.
   * @example "https://example.com/audio-file.mp3"
   */
  audio_url?: string;

  /**
   * Caches the audio file. Useful when playing the same audio file multiple times during the call.
   * @default true
   */
  cache_audio?: boolean;

  /**
   * Use this field to add state to every subsequent webhook. It must be a valid Base-64 encoded string.
   * @example "client_state_example"
   */
  client_state?: string;

  /**
   * Use this field to avoid duplicate commands. VOXO will ignore any command with the same command_id for the same call_control_id.
   * @example "command_id_example"
   */
  command_id?: string;

  /**
   * Specifies the number of times the audio file should be played.
   * @example 3
   */
  loop?: string | number;

  /**
   * The media_name of a file to be played back on the call. The media_name must point to a file previously uploaded to api.VOXO.com/v2/media by the same user/organization.
   * The file must either be a WAV or MP3 file.
   * @example "media_name_example"
   */
  media_name?: string;

  /**
   * When enabled, audio will be mixed on top of any other audio that is actively being played back.
   * Note that overlay: true will only work if there is another audio file already being played on the call.
   * @default false
   */
  overlay?: boolean;

  /**
   * Allows a user to provide base64 encoded mp3.
   * Note: when using this parameter, media_url and media_name in the playback_started and playback_ended webhooks will be empty.
   * @example "base64_encoded_mp3"
   */
  playback_content?: string;

  /**
   * When specified, it stops the current audio being played.
   * @enum "current" - Stop the current audio being played, and play the next file in the queue.
   * @enum "all" - Stop the current audio file being played and clear all audio files from the queue.
   * @example "current"
   */
  stop?: "current" | "all";

  /**
   * Specifies the leg or legs on which audio will be played.
   * @default "self"
   * @enum "self" - Play audio on the current leg.
   * @enum "opposite" - Play audio on the opposite leg.
   * @enum "both" - Play audio on both legs.
   * @example "self"
   */
  target_legs?: "self" | "opposite" | "both";
};

export type StopAudioRequest = {
  /**
   * Use this field to add state to every subsequent webhook. It must be a valid Base-64 encoded string.
   */
  client_state?: string;

  /**
   * Use this field to avoid duplicate commands. VOXO will ignore any command with the same command_id for the same call_control_id.
   */
  command_id?: string;

  /**
   * When enabled, it stops the audio being played in the overlay queue.
   * @default false
   */
  overlay?: boolean;

  /**
   * Use current to stop the current audio being played. Use all to stop the current audio file being played and clear all audio files from the queue.
   * @default "all"
   * @enum "current" | "all"
   */
  stop?: "current" | "all";
};

export type PauseRecordingRequest = {
  /**
   * client_state is used to add state to every subsequent webhook.
   * It must be a valid Base-64 encoded string.
   */
  client_state?: string;

  /**
   * command_id is used to avoid duplicate commands.
   * VOXO will ignore any command with the same command_id for the same call_control_id.
   */
  command_id?: string;
};

export type ResumeRecordingRequest = {
  /**
   * @description The client state that should be added to every subsequent webhook.
   * @example "c2FtcGxlX3N0YXRl"
   */
  client_state?: string;

  /**
   * @description The command ID used to avoid duplicate commands.
   * @example "command_123"
   */
  command_id?: string;
};

export type StartRecordingRequest = {
  /**
   * When dual, final audio file will be stereo recorded with the first leg on channel A, and the rest on channel B.
   * @enum {"single", "dual"}
   */
  channels: "single" | "dual";

  /**
   * Use this field to add state to every subsequent webhook. It must be a valid Base-64 encoded string.
   */
  client_state?: string;

  /**
   * Use this field to avoid duplicate commands. VOXO will ignore any command with the same command_id for the same call_control_id.
   */
  command_id?: string;

  /**
   * The audio file format used when storing the call recording. Can be either mp3 or wav.
   * @enum {"wav", "mp3"}
   */
  format: "wav" | "mp3";

  /**
   * Defines the maximum length for the recording in seconds. The minimum value is 0. The maximum value is 14400. The default value is 0 (infinite)
   * @default 0
   */
  max_length?: number;

  /**
   * If enabled, a beep sound will be played at the start of a recording.
   */
  play_beep?: boolean;

  /**
   * The number of seconds that VOXO will wait for the recording to be stopped if silence is detected. The timer only starts when the speech is detected. The minimum value is 0. The default value is 0 (infinite)
   * @default 0
   */
  timeout_secs?: number;
};

export type StopRecordingRequest = {
  /**
   * Base-64 encoded string to add state to every subsequent webhook.
   * @example "dGVzdA=="
   */
  client_state?: string;

  /**
   * Unique identifier to avoid duplicate commands. VOXO will ignore any command with the same command_id for the same call_control_id.
   * @example "command123"
   */
  command_id?: string;
};

export type ReferRequest = {
  /**
   * Use this field to add state to every subsequent webhook.
   * It must be a valid Base-64 encoded string.
   * @example "aW5pdGlhbF9zdGF0ZQ=="
   */
  client_state?: string;

  /**
   * Use this field to avoid execution of duplicate commands.
   * VOXO will ignore subsequent commands with the same command_id as one that has already been executed.
   * @example "cmd-1234"
   */
  command_id?: string;

  /**
   * Custom headers to be added to the SIP INVITE.
   * @example [{ name: "X-Custom-Header", value: "example_value" }]
   */
  custom_headers?: CustomSipHeader[];

  /**
   * The SIP URI to which the call will be referred to.
   * @example "sip:1234567890@example.com"
   */
  sip_address: string;

  /**
   * SIP Authentication password used for SIP challenges.
   * @example "mypassword"
   */
  sip_auth_password?: string;

  /**
   * SIP Authentication username used for SIP challenges.
   * @example "myusername"
   */
  sip_auth_username?: string;
};

export type RejectRequest = {
  /**
   * Cause for call rejection.
   * @enums "CALL_REJECTED" "USER_BUSY"
   */
  cause: "CALL_REJECTED" | "USER_BUSY";

  /**
   * Use this field to add state to every subsequent webhook.
   * It must be a valid Base-64 encoded string.
   * @example "dGhpcyBpcyBhIHRlc3Qgc3RhdGU="
   */
  client_state?: string;

  /**
   * Use this field to avoid duplicate commands.
   * VOXO will ignore any command with the same command_id for the same call_control_id.
   * @example "abc123"
   */
  command_id?: string;
};

export type SendDtmfRequest = {
  /**
   * Use this field to add state to every subsequent webhook.
   * It must be a valid Base-64 encoded string.
   * @example "dGhpcyBpcyBhIHRlc3Qgc3RhdGU="
   */
  client_state?: string;

  /**
   * Use this field to avoid duplicate commands.
   * VOXO will ignore any command with the same command_id for the same call_control_id.
   * @example "abc123"
   */
  command_id?: string;

  /**
   * DTMF digits to send. Valid digits are 0-9, A-D, *, and #.
   * Pauses can be added using w (0.5s) and W (1s).
   * @example "123#"
   */
  digits: string;

  /**
   * Specifies for how many milliseconds each digit will be played in the audio stream.
   * Ranges from 100 to 500ms.
   * @default 250
   */
  duration_millis?: number;
};

export type SpeakTextRequest = {
  /**
   * Use this field to add state to every subsequent webhook. It must be a valid Base-64 encoded string.
   */
  client_state?: string;

  /**
   * Use this field to avoid duplicate commands. VOXO will ignore any command with the same command_id for the same call_control_id.
   */
  command_id?: string;

  /**
   * The language you want spoken.
   * @enum ["arb", "cmn-CN", "cy-GB", "da-DK", "de-DE", "en-AU", "en-GB", "en-GB-WLS", "en-IN", "en-US", "es-ES", "es-MX", "es-US", "fr-CA", "fr-FR", "hi-IN", "is-IS", "it-IT", "ja-JP", "ko-KR", "nb-NO", "nl-NL", "pl-PL", "pt-BR", "pt-PT", "ro-RO", "ru-RU", "sv-SE", "tr-TR"]
   */
  language: string;

  /**
   * The text or SSML to be converted into speech. There is a 3,000 character limit.
   */
  payload: string;

  /**
   * The export type of the provided payload. The payload can either be plain text, or Speech Synthesis Markup Language (SSML).
   * @default "text"
   * @enum ["text", "ssml"]
   */
  payload_type?: string;

  /**
   * This parameter impacts speech quality, language options and payload types. When using basic, only the en-US language and payload export type text are allowed.
   * @default "premium"
   * @enum ["basic", "premium"]
   */
  service_level?: string;

  /**
   * When specified, it stops the current audio being played. Specify current to stop the current audio being played, and to play the next file in the queue. Specify all to stop the current audio file being played and to also clear all audio files from the queue.
   */
  stop?: string;

  /**
   * The gender of the voice used to speak back the text.
   * @enum ["male", "female"]
   */
  voice: string;
};

export type StartStreamRequest = {
  /**
   * Use this field to add state to every subsequent webhook.
   * It must be a valid Base-64 encoded string.
   */
  client_state: string;

  /**
   * Use this field to avoid duplicate commands.
   * VOXO will ignore any command with the same command_id for the same call_control_id.
   */
  command_id: string;

  /**
   * Dialogflow configuration object.
   */
  dialogflow_config: DialogflowConfig;

  /**
   * Enables Dialogflow for the current call.
   * @default false
   */
  enable_dialogflow?: boolean;

  /**
   * Specifies which track should be streamed.
   * @default "inbound_track"
   * @enum "inbound_track" "outbound_track" "both_tracks"
   */
  stream_track?: "inbound_track" | "outbound_track" | "both_tracks";

  /**
   * The destination WebSocket address where the stream is going to be delivered.
   */
  stream_url: string;
};

export type StopStreamRequest = {
  /**
   * The client state to be added to every subsequent webhook.
   * Must be a valid Base-64 encoded string.
   */
  client_state: string;
  /**
   * The command ID to avoid duplicate commands.
   * VOXO will ignore any command with the same command_id for the same call_control_id.
   */
  command_id: string;
};

export type StartTranscriptionRequest = {
  /**
   * Base-64 encoded string for client state.
   */
  client_state?: string;

  /**
   * Command ID to avoid duplicate commands.
   */
  command_id?: string;

  /**
   * @default false
   * Whether to send interim results.
   */
  interim_results?: boolean;

  /**
   * @default "en"
   * @enum "de" | "en" | "es" | "fr" | "it" | "pl"
   * Language for speech recognition.
   */
  language?: "de" | "en" | "es" | "fr" | "it" | "pl";

  /**
   * @default "inbound"
   * Leg of the call to be transcribed.
   * @example "inbound"
   * @example "outbound"
   * @example "both"
   */
  transcription_tracks?: "inbound" | "outbound" | "both";
};

export type StopTranscriptionRequest = {
  /**
   * Use this field to add state to every subsequent webhook.
   * It must be a valid Base-64 encoded string.
   */
  client_state?: string;

  /**
   * Use this field to avoid duplicate commands.
   * VOXO will ignore any command with the same command_id for the same call_control_id.
   */
  command_id?: string;
};

export type TransferRequest = {
  /**
   * Enables Answering Machine Detection. When a call is answered, VOXO runs real-time detection to determine if it was picked up by a human or a machine and sends an call.machine.detection.ended webhook with the analysis result. If 'greeting_end' or 'detect_words' is used and a 'machine' is detected, you will receive another 'call.machine.greeting.ended' webhook when the answering machine greeting ends with a beep or silence. If detect_beep is used, you will only receive 'call.machine.greeting.ended' if a beep is detected.
   * @enum ["detect", "detect_beep", "detect_words", "greeting_end", "disabled"]
   * @default "disabled"
   */
  answering_machine_detection?:
    | "detect"
    | "detect_beep"
    | "detect_words"
    | "greeting_end"
    | "disabled";

  /**
   * Optional configuration parameters to modify 'answering_machine_detection' performance.
   */
  answering_machine_detection_config?: AnsweringMachineDetectionConfig;

  /**
   * The URL of a file to be played back when the transfer destination answers before bridging the call. The URL can point to either a WAV or MP3 file. media_name and audio_url cannot be used together in one request.
   */
  audio_url?: string;

  /**
   * Use this field to add state to every subsequent webhook. It must be a valid Base-64 encoded string.
   */
  client_state?: string;

  /**
   * Use this field to avoid duplicate commands. VOXO will ignore any command with the same command_id for the same call_control_id.
   */
  command_id?: string;

  /**
   * Array of objects (Custom SIP Header) Custom headers to be added to the SIP INVITE.
   */
  custom_headers?: Array<SipHeader>;

  /**
   * The from number to be used as the caller id presented to the destination (to number). The number should be in +E164 format. This attribute will default to the to number of the original call if omitted.
   */
  from?: string;

  /**
   * The from_display_name string to be used as the caller id name (SIP From Display Name) presented to the destination (to number). The string should have a maximum of 128 characters, containing only letters, numbers, spaces, and -_~!.+ special characters. If ommited, the display name will be the same as the number in the from field.
   */
  from_display_name?: string;

  /**
   * The media_name of a file to be played back when the transfer destination answers before bridging the call. The media_name must point to a file previously uploaded to api.VOXO.com/v2/media by the same user/organization. The file must either be a WAV or MP3 file.
   */
  media_name?: string;

  /**
   * SIP Authentication password used for SIP challenges.
   */
  sip_auth_password?: string;

  /**
   * SIP Authentication username used for SIP challenges.
   */
  sip_auth_username?: string;

  /**
   * Array of objects (SIP Header) SIP headers to be added to the SIP INVITE. Currently only User-to-User header is supported.
   */
  sip_headers?: Array<SipHeader>;

  /**
   * Use this field to modify sound effects, for example adjust the pitch.
   */
  sound_modifications?: SoundModifications;

  /**
   * Use this field to add state to every subsequent webhook for the new leg. It must be a valid Base-64 encoded string.
   */
  target_leg_client_state?: string;

  /**
   * Sets the maximum duration of a Call Control Leg in seconds. If the time limit is reached, the call will hangup and a call.hangup webhook with a hangup_cause of time_limit will be sent. For example, by setting a time limit of 120 seconds, a Call Leg will be automatically terminated two minutes after being answered. The default time limit is 14400 seconds or 4 hours and this is also the maximum allowed call length.
   * @default 14400
   * @example 14400
   */
  time_limit_secs?: number;

  /**
   * The number of seconds that VOXO will wait for the call to be answered by the destination to which it is being transferred. If the timeout is reached before an answer is received, the call will hangup and a call.hangup webhook with a hangup_cause of timeout will be sent. Minimum value is 5 seconds. Maximum value is 120 seconds.
   * @default 30
   * @example 30
   */
  timeout_secs?: number;

  /**
   * The DID or SIP URI to dial out and bridge to the given call.
   */
  to: string;

  /**
   * Use this field to override the URL for which VOXO will send subsequent webhooks to for this call.
   */
  webhook_url?: string;

  /**
   * HTTP request export type used for webhook_url.
   * @enum ["POST", "GET"]
   * @default "POST"
   */
  webhook_url_method?: "POST" | "GET";
};

export type UpdateStateRequest = {
  /**
   * Use this field to add state to every subsequent webhook.
   * It must be a valid Base-64 encoded string.
   * @example "dXBkYXRlX3N0YXRlX2V4YW1wbGU="
   */
  client_state: string;
};

export type CallBase = {
  /**
   * ID that is unique to the call session and can be used to correlate webhook events.
   * Call session is a group of related call legs that logically belong to the same phone call,
   * e.g. an inbound and outbound leg of a transferred call.
   * @example "428c31b6-7af4-4bcb-b68e-5013ef9657c1"
   */
  call_session_id: string;

  /**
   * ID that is unique to the call and can be used to correlate webhook events.
   * @example "428c31b6-7af4-4bcb-b7f5-5013ef9657c1"
   */
  call_leg_id: string;

  /**
   * Unique identifier and token for controlling the call.
   * @example "v3:MdI91X4lWFEs7IgbBEOT9M4AigoY08M0WWZFISt1Yw2axZ_IiE4pqg"
   */
  call_control_id: string;

  /**
   * State received from a command.
   * @example "aGF2ZSBhIG5pY2UgZGF5ID1d"
   */
  client_state?: string;

  /**
   * Call Control App ID (formerly VOXO connection ID) used in the call.
   */
  connection_id: string;
};

interface Call extends CallBase {
  /**
   * Record type, always "call" for CallResponse.
   * @example "call"
   */
  record_type: "call";

  /**
   * Indicates the duration of the call in seconds.
   * @example 50
   */
  call_duration?: number;
}

export type ListCallsResponse = {
  /**
   * List of calls.
   * @example []
   */
  data: Array<Call>;
};

export type SendFaxRequest = {
  /**
   * The connection ID to send the fax with.
   */
  connection_id: string;

  /**
   * The phone number, in E.164 format, the fax will be sent from.
   */
  from: string;

  /**
   * The media_name used for the fax's media. Must point to a file previously uploaded to api.voxo.com/v2/media by the same user/organization. media_name and media_url/contents can't be submitted together.
   */
  media_name?: string;

  /**
   * The URL to the PDF used for the fax's media. media_url and media_name/contents can't be submitted together.
   */
  media_url?: string;

  /**
   * The flag to enable monochrome, true black and white fax results.
   * @default false
   */
  monochrome?: boolean;

  /**
   * The quality of the fax. Can be normal, high, very_high
   * @default "high"
   * @enum "normal" | "high" | "very_high"
   */
  quality?: "normal" | "high" | "very_high";

  /**
   * Should fax media be stored on temporary URL. It does not support media_name, they can't be submitted together.
   * @default false
   */
  store_media?: boolean;

  /**
   * The flag to disable the T.38 protocol.
   * @default true
   */
  t38_enabled?: boolean;

  /**
   * The phone number, in E.164 format, the fax will be sent to or SIP URI
   */
  to: string;

  /**
   * Use this field to override the URL to which VOXO will send subsequent webhooks for this fax.
   */
  webhook_url?: string;
};

export type SendFaxResponse = {
  /**
   * The ID of the connection used to send the fax.
   */
  connection_id: string;

  /**
   * ISO 8601 timestamp when resource was created
   */
  created_at: string;

  /**
   * The direction of the fax.
   * @enum ["inbound", "outbound"]
   */
  direction: "inbound" | "outbound";

  /**
   * The phone number, in E.164 format, the fax will be sent from.
   */
  from: string;

  /**
   * Identifies the resource.
   */
  id: string;

  /**
   * The media_name used for the fax's media. Must point to a file previously uploaded to api.voxo.com/v2/media by the same user/organization. media_name and media_url/contents can't be submitted together.
   */
  media_name: string;

  /**
   * The URL to the PDF used for the fax's media. media_url and media_name/contents can't be submitted together.
   */
  media_url: string;

  /**
   * The quality of the fax. Can be normal, high, very_high
   * @default "high"
   */
  quality: "normal" | "high" | "very_high";

  /**
   * Identifies the type of the resource.
   * @example "fax"
   */
  record_type: string;

  /**
   * Status of the fax
   * @enum ["queued", "media.processed", "originated", "sending", "delivered", "failed", "initiated", "receiving", "media.processing", "received"]
   */
  status:
    | "queued"
    | "media.processed"
    | "originated"
    | "sending"
    | "delivered"
    | "failed"
    | "initiated"
    | "receiving"
    | "media.processing"
    | "received";

  /**
   * Should fax media be stored on temporary URL. It does not support media_name.
   */
  store_media: boolean;

  /**
   * If store_media was set to true, this is a link to temporary location. Link expires after 10 minutes.
   */
  stored_media_url: string;

  /**
   * The phone number, in E.164 format, the fax will be sent to or SIP URI
   */
  to: string;

  /**
   * ISO 8601 timestamp when resource was updated
   */
  updated_at: string;

  /**
   * Optional failover URL that will receive fax webhooks if webhook_url doesn't return a 2XX response
   */
  webhook_failover_url: string;

  /**
   * URL that will receive fax webhooks
   */
  webhook_url: string;
};

export interface CallInitiatedEvent {
  data: {
    /**
     * The type of event being delivered.
     * @example "call.initiated"
     */
    event_type: "call.initiated";

    /**
     * Identifies the type of resource.
     */
    id: string;

    /**
     * ISO 8601 datetime of when the event occurred.
     */
    occurred_at: string;

    payload: CallBase & {
      /**
       * Custom headers from sip invite
       */
      custom_headers: CustomSipHeader[];

      /**
       * Whether the call is incoming or outgoing.
       * @enum "incoming" "outgoing"
       */
      direction: string;

      /**
       * Number or SIP URI placing the call.
       */
      from: string;

      /**
       * State received from a command.
       * @enum "parked" "bridging"
       */
      state: "bridging" | "parked";

      /**
       * Destination number or SIP URI of the call.
       */
      to: string;
    };

    /**
     * Identifies the type of the resource.
     * @example "event"
     */
    record_type: "event";
  };
}

export interface CallAnsweredEvent {
  data: {
    /**
     * The type of event being delivered.
     * @example "call.answered"
     */
    event_type: "call.answered";

    /**
     * Identifies the type of resource.
     */
    id: string;

    /**
     * ISO 8601 datetime of when the event occurred.
     */
    occurred_at: string;

    payload: CallBase & {
      /**
       * Custom headers from sip invite
       */
      custom_headers: CustomSipHeader[];

      /**
       * Whether the call is incoming or outgoing.
       * @enum "incoming" "outgoing"
       */
      direction: string;

      /**
       * Number or SIP URI placing the call.
       */
      from: string;

      /**
       * State received from a command.
       * @enum "answered"
       */
      state: "answered";

      /**
       * Destination number or SIP URI of the call.
       */
      to: string;
    };

    /**
     * Identifies the type of the resource.
     * @example "event"
     */
    record_type: "event";
  };
}

export interface CallHangupEvent {
  /**
   * The type of event being delivered.
   * @enum "call.hangup"
   */
  event_type: "call.hangup";

  /**
   * Identifies the type of resource.
   * @example "uuid"
   */
  id: string;

  /**
   * ISO 8601 datetime of when the event occurred.
   * @example "2020-01-01T00:00:00Z"
   */
  occurred_at: string;

  payload: CallBase & {
    /**
     * The reason the call was ended.
     * @enum "call_rejected" | "normal_clearing" | "originator_cancel" | "timeout" | "time_limit" | "user_busy" | "not_found" | "unspecified"
     */
    hangup_cause:
      | string
      | "call_rejected"
      | "normal_clearing"
      | "originator_cancel"
      | "timeout"
      | "time_limit"
      | "user_busy"
      | "not_found"
      | "unspecified";
    hangup_source: string | "caller" | "callee" | "unknown";
    sip_hangup_cause: string;
    start_time: string;

    /**
     * State received from a command.
     * @default "hangup"
     */
    state: "hangup";

    to: string;
  };

  record_type: "event";
}

export interface CallMachineDetectionEndedEvent {
  /**
   * The type of event being delivered.
   * @enum "call.machine.detection.ended"
   */
  event_type: "call.machine.detection.ended";

  /**
   * Identifies the type of resource.
   */
  id: string;

  /**
   * ISO 8601 datetime of when the event occurred.
   */
  occurred_at: string;

  /**
   * @example { record_type: "event" }
   */
  payload: CallBase & {
    /**
     * Answering machine detection result.
     * @enum "human" | "machine" | "not_sure"
     */
    result: "human" | "machine" | "not_sure";
  };

  /**
   * Identifies the type of the resource.
   * @default "event"
   */
  record_type: "event";
}

export interface CallMachineGreetingEndedEvent {
  /**
   * The type of event being delivered.
   * @enum "call.machine.greeting.ended"
   */
  event_type: "call.machine.greeting.ended";

  /**
   * Identifies the type of resource.
   */
  id: string;

  /**
   * ISO 8601 datetime of when the event occurred.
   */
  occurred_at: string;

  /**
   * @example { record_type: "event" }
   */
  payload: CallBase & {
    /**
     * Answering machine detection result.
     * @enum "ended" | "not_sure"
     */
    result: "ended" | "not_sure";
  };

  /**
   * Identifies the type of the resource.
   * @default "event"
   */
  record_type: "event";
}

export interface StreamingStartedEvent {
  /**
   * The type of event being delivered.
   * @enum "streaming.started"
   */
  event_type: "streaming.started";

  /**
   * Identifies the type of resource.
   */
  id: string;

  /**
   * ISO 8601 datetime of when the event occurred.
   */
  occurred_at: string;

  /**
   * @example { record_type: "event" }
   */
  payload: CallBase & {
    /**
     * Destination WebSocket address where the stream is going to be delivered.
     */
    stream_url: string;
  };

  /**
   * Identifies the type of the resource.
   * @default "event"
   */
  record_type: "event";
}

export interface StreamingStoppedEvent {
  /**
   * The type of event being delivered.
   * @enum "streaming.stopped"
   */
  event_type: "streaming.stopped";

  /**
   * Identifies the type of resource.
   */
  id: string;

  /**
   * ISO 8601 datetime of when the event occurred.
   */
  occurred_at: string;

  /**
   * @example { record_type: "event" }
   */
  payload: CallBase & {
    /**
     * Destination WebSocket address where the stream is going to be delivered.
     */
    stream_url: string;
  };

  /**
   * Identifies the type of the resource.
   * @default "event"
   */
  record_type: "event";
}

export interface CallBridgedEvent {
  data: {
    /**
     * The type of event being delivered.
     * @example "call.bridged"
     */
    event_type: "call.bridged";

    /**
     * Identifies the type of resource.
     */
    id: string;

    /**
     * ISO 8601 datetime of when the event occurred.
     */
    occurred_at: string;

    payload: CallBase & {
      /**
       * Number or SIP URI placing the call.
       */
      from: string;

      /**
       * State received from a command.
       * @enum "bridged"
       */
      state: "bridged";

      /**
       * Destination number or SIP URI of the call.
       */
      to: string;
    };

    /**
     * Identifies the type of the resource.
     * @example "event"
     */
    record_type: "event";
  };
}

export interface CallQueuedEvent {
  data: {
    /**
     * The type of event being delivered.
     * @example "call.enqueued"
     */
    event_type: "call.enqueued";

    /**
     * Identifies the type of resource.
     */
    id: string;

    /**
     * ISO 8601 datetime of when the event occurred.
     */
    occurred_at: string;

    payload: CallBase & {
      /**
       * Current position of the call in the queue
       */
      current_position: number;

      /**
       * The name of the queue
       */
      queue: string;
    };

    /**
     * Identifies the type of the resource.
     * @example "event"
     */
    record_type: "event";
  };
}

export interface CallDequeuedEvent {
  data: {
    /**
     * The type of event being delivered.
     * @example "call.dequeued"
     */
    event_type: "call.dequeued";

    /**
     * Identifies the type of resource.
     */
    id: string;

    /**
     * ISO 8601 datetime of when the event occurred.
     */
    occurred_at: string;

    payload: CallBase & {
      /**
       * Last position of the call in the queue
       */
      queue_position: number;

      /**
       * The name of the queue
       */
      queue: string;

      /**
       * Reason why the call was dequeued
       * @enum "bridged" | "bridging-in-process" | "hangup" | "leave" | "timeout"
       * @example "bridged"
       */
      reason:
        | "bridged"
        | "bridging-in-process"
        | "hangup"
        | "leave"
        | "timeout";
    };

    /**
     * Identifies the type of the resource.
     * @example "event"
     */
    record_type: string | "event";
  };
}

export interface ForkStartedEvent {
  data: {
    /**
     * The type of event being delivered.
     * @example "call.fork.started"
     */
    event_type: "call.fork.started";

    /**
     * Identifies the type of resource.
     */
    id: string;

    /**
     * ISO 8601 datetime of when the event occurred.
     */
    occurred_at: string;

    payload: CallBase & {
      /**
       * The type of media streamed
       * @enum "raw" | "decrypted"
       */
      stream_type: "raw" | "decrypted";
    };

    /**
     * Identifies the type of the resource.
     * @example "event"
     */
    record_type: string | "event";
  };
}

export interface DtmfReceivedEvent {
  data: {
    /**
     * The type of event being delivered.
     * @example "call.dtmf.received"
     */
    event_type: "call.dtmf.received";

    /**
     * Identifies the type of resource.
     */
    id: string;

    /**
     * ISO 8601 datetime of when the event occurred.
     */
    occurred_at: string;

    payload: CallBase & {
      /**
       * The DTMF digit received
       */
      digit: string;

      /**
       * Number or SIP URI placing the call.
       * @example "+15555555555"
       */
      from: string;

      /**
       * Destination number or SIP URI of the call.
       * @example "+15555555555"
       */
      to: string;
    };

    /**
     * Identifies the type of the resource.
     * @example "event"
     */
    record_type: "event";
  };
}

export interface GatherEndedEvent {
  data: {
    /**
     * The type of event being delivered.
     * @example "call.gather.ended"
     */
    event_type: "call.gather.ended";

    /**
     * Identifies the type of resource.
     */
    id: string;

    /**
     * ISO 8601 datetime of when the event occurred.
     */
    occurred_at: string;

    payload: CallBase & {
      /**
       * The DTMF digits received
       */
      digits: string;

      /**
       * Number or SIP URI placing the call.
       * @example "+15555555555"
       */
      from: string;

      /**
       * Reflects how the command ended
       * @enum "valid" | "invalid" | "call_hangup" | "timeout" | "cancelled" | "cancelled_amd"
       * @example "valid"
       */
      reason:
        | "valid"
        | "invalid"
        | "call_hangup"
        | "timeout"
        | "cancelled"
        | "cancelled_amd";

      /**
       * Destination number or SIP URI of the call.
       * @example "+15555555555"
       */
      to: string;
    };

    /**
     * Identifies the type of the resource.
     * @example "event"
     */
    record_type: "event";
  };
}

export interface ForkStoppedEvent {
  data: {
    /**
     * The type of event being delivered.
     * @example "call.fork.stopped"
     */
    event_type: "call.fork.stopped";

    /**
     * Identifies the type of resource.
     */
    id: string;

    /**
     * ISO 8601 datetime of when the event occurred.
     */
    occurred_at: string;

    payload: CallBase & {
      /**
       * The type of media streamed
       * @enum "raw" | "decrypted"
       */
      stream_type: "raw" | "decrypted";
    };

    /**
     * Identifies the type of the resource.
     * @example "event"
     */
    record_type: "event";
  };
}

export interface PlaybackEndedEvent {
  data: {
    /**
     * The type of event being delivered.
     * @example "call.playback.ended"
     */
    event_type: "call.playback.ended";

    /**
     * Identifies the type of resource.
     */
    id: string;

    /**
     * ISO 8601 datetime of when the event occurred.
     */
    occurred_at: string;

    payload: CallBase & {
      /**
       * The type of media streamed
       * @enum "raw" | "decrypted"
       */
      stream_type: "raw" | "decrypted";

      /**
       * Whether the stopped audio was in overlay mode or not.
       */
      overlay: boolean;

      /**
       * Reflects how command ended.
       * @enum "file_not_found" | "call_hangup" | "unknown" | "failed" | "cancelled_amd" | "completed" | "cancelled"
       * @example "completed"
       */
      reason:
        | "file_not_found"
        | "call_hangup"
        | "unknown"
        | "failed"
        | "cancelled_amd"
        | "completed"
        | "cancelled";
    };

    /**
     * Identifies the type of the resource.
     * @example "event"
     */
    record_type: "event";
  };
}

export interface PlaybackStartedEvent {
  data: {
    /**
     * The type of event being delivered.
     * @example "call.playback.started"
     */
    event_type: "call.playback.started";

    /**
     * Identifies the type of resource.
     */
    id: string;

    /**
     * ISO 8601 datetime of when the event occurred.
     */
    occurred_at: string;

    payload: CallBase & {
      /**
       * The name of the audio media file being played back, if media_name has been used to start.
       */
      media_name: string;

      /**
       * The audio URL being played back, if audio_url has been used to start.
       */
      media_url: "event";
    };

    /**
     * Identifies the type of the resource.
     * @example "event"
     */
    record_type: "event";
  };
}

export interface SpeakEndedEvent {
  data: {
    /**
     * The type of event being delivered.
     * @example "call.speak.ended"
     */
    event_type: "call.speak.ended";

    /**
     * Identifies the type of resource.
     */
    id: string;

    /**
     * ISO 8601 datetime of when the event occurred.
     */
    occurred_at: string;

    payload: CallBase & {
      /**
       * Reflects how the command ended.
       */
      status: "completed" | "call_hangup" | "cancelled_amd";
    };

    /**
     * Identifies the type of the resource.
     * @example "event"
     */
    record_type: "event";
  };
}

export interface SpeakStartedEvent {
  data: {
    /**
     * The type of event being delivered.
     * @example "call.speak.started"
     */
    event_type: "call.speak.started";

    /**
     * Identifies the type of resource.
     */
    id: string;

    /**
     * ISO 8601 datetime of when the event occurred.
     */
    occurred_at: string;

    payload: CallBase;

    /**
     * Identifies the type of the resource.
     * @example "event"
     */
    record_type: "event";
  };
}

export interface RecordingErrorEvent {
  data: {
    /**
     * The type of event being delivered.
     * @example "call.recording.error"
     */
    event_type: "call.recording.error";

    /**
     * Identifies the type of resource.
     */
    id: string;

    /**
     * ISO 8601 datetime of when the event occurred.
     */
    occurred_at: string;

    payload: CallBase & {
      /**
       * Indication that there was a problem recording the call.
       */
      reason:
        | "Failed to authorize with storage using custom credentials"
        | "Invalid credentials json"
        | "Unsupported backend"
        | "Internal server error";
    };

    /**
     * Identifies the type of the resource.
     * @example "event"
     */
    record_type: "event";
  };
}

export interface RecordingSavedEvent {
  data: {
    /**
     * The type of event being delivered.
     * @example "call.recording.saved"
     */
    event_type: "call.recording.saved";

    /**
     * Identifies the type of resource.
     */
    id: string;

    /**
     * ISO 8601 datetime of when the event occurred.
     */
    occurred_at: string;

    payload: CallBase & {
      /**
       * Whether recording was recorded in `single` or `dual` channel.
       * @enum "single" | "dual"
       */
      channel: "single" | "dual";

      /**
       * Recording URLs in requested format. The URL is valid for as long as the file exists. For security purposes, this feature is activated on a per request basis. Please contact customer support with your Account ID to request activation.
       */
      recording_urls: {
        /**
         * Recording URL in requested format
         */
        mp3?: string;

        /**
         * Recording URL in requested format
         */
        wav?: string;
      };

      /**
       * ISO 8601 datetime of when recording ended.
       * @example "2020-01-01T00:00:00Z"
       */
      recording_ended_at: string;

      /**
       * ISO 8601 datetime of when recording started.
       * @example "2020-01-01T00:00:00Z"
       */
      recording_started_at: string;

      /**
       * Recording URLs in requested format. The URL is valid for as long as the file exists. For security purposes, this feature is activated on a per request basis. Please contact customer support with your Account ID to request activation.
       */
      public_recording_urls: {
        /**
         * Recording URL in requested format
         */
        mp3?: string;

        /**
         * Recording URL in requested format
         */
        wav?: string;
      };
    };

    /**
     * Identifies the type of the resource.
     * @example "event"
     */
    record_type: "event";
  };
}

export interface ReferCompletedEvent {
  data: {
    /**
     * The type of event being delivered.
     * @example "call.refer.completed"
     */
    event_type: "call.refer.completed";

    /**
     * Identifies the type of resource.
     */
    id: string;

    /**
     * ISO 8601 datetime of when the event occurred.
     */
    occurred_at: string;

    payload: CallBase & {
      /**
       * Number or SIP URI placing the call.
       * @example "+15555555555"
       */
      from: string;

      /**
       * Destination number or SIP URI of the call.
       * @example "+15555555555"
       */
      to: string;

      /**
       * SIP NOTIFY event status for tracking the REFER attempt.
       */
      sip_notify_response: number;
    };

    /**
     * Identifies the type of the resource.
     * @example "event"
     */
    record_type: "event";
  };
}

export interface ReferFailedEvent {
  data: {
    /**
     * The type of event being delivered.
     * @example "call.refer.failed"
     */
    event_type: "call.refer.failed";

    /**
     * Identifies the type of resource.
     */
    id: string;

    /**
     * ISO 8601 datetime of when the event occurred.
     */
    occurred_at: string;

    payload: CallBase & {
      /**
       * Number or SIP URI placing the call.
       * @example "+15555555555"
       */
      from: string;

      /**
       * Destination number or SIP URI of the call.
       * @example "+15555555555"
       */
      to: string;

      /**
       * SIP NOTIFY event status for tracking the REFER attempt.
       */
      sip_notify_response: number;
    };

    /**
     * Identifies the type of the resource.
     * @example "event"
     */
    record_type: "event";
  };
}

export interface ReferStartedEvent {
  data: {
    /**
     * The type of event being delivered.
     * @example "call.refer.started"
     */
    event_type: "call.refer.started";

    /**
     * Identifies the type of resource.
     */
    id: string;

    /**
     * ISO 8601 datetime of when the event occurred.
     */
    occurred_at: string;

    payload: CallBase & {
      /**
       * Number or SIP URI placing the call.
       * @example "+15555555555"
       */
      from: string;

      /**
       * Destination number or SIP URI of the call.
       * @example "+15555555555"
       */
      to: string;

      /**
       * SIP NOTIFY event status for tracking the REFER attempt.
       */
      sip_notify_response: number;
    };

    /**
     * Identifies the type of the resource.
     * @example "event"
     */
    record_type: "event";
  };
}

export interface TranscriptionEvent {
  data: {
    /**
     * The type of event being delivered.
     * @example "call.transcription"
     */
    event_type: "call.transcription";

    /**
     * Identifies the type of resource.
     */
    id: string;

    /**
     * ISO 8601 datetime of when the event occurred.
     */
    occurred_at: string;

    payload: CallBase & {
      transcription_data: {
        /**
         * Speech recognition confidence level.
         */
        confidence: number;

        /**
         * When false, it means that this is an interim result.
         */
        is_final: boolean;

        /**
         * Recognized text.
         * @example "Hello World"
         */
        transcript: string;
      };
    };

    /**
     * Identifies the type of the resource.
     * @example "event"
     */
    record_type: "event";
  };
}

export type ListConferencesRequest = {
  /**
   * If present, conferences will be filtered to those with a matching name attribute. Matching is case-sensitive
   * @example "Conference Room 1"
   */
  filter?: {
    name?: string;
    /**
     * If present, conferences will be filtered by status.
     * @enum "init" "in_progress" "completed"
     */
    status?: "init" | "in_progress" | "completed";
  };
  page?: {
    /**
     * The page number to load
     * @default 1
     * @example 2
     */
    number?: number;
    /**
     * The size of the page
     * @default 20
     * @example 50
     * @range [1, 250]
     */
    size?: number;
  };
};

export interface ListConferencesResponse {
  data: Array<{
    connection_id: string;
    /**
     * ISO 8601 formatted date of when the conference was created
     */
    created_at: string;
    /**
     * Reason why the conference ended
     * @enum "all_left" | "ended_via_api" | "host_left" | "time_exceeded"
     */
    end_reason?: "all_left" | "ended_via_api" | "host_left" | "time_exceeded";
    /**
     * IDs related to who ended the conference. It is expected for them to all be there or all be null
     */
    ended_by?: {
      user_id?: string;
      participant_id?: string;
      call_control_id?: string;
    };
    /**
     * ISO 8601 formatted date of when the conference will expire
     */
    expires_at: string;
    /**
     * Uniquely identifies the conference
     */
    id: string;
    /**
     * Name of the conference
     */
    name: string;
    /**
     * Value: "conference"
     */
    record_type: "conference";
    /**
     * Region where the conference is hosted
     */
    region?: string;
    /**
     * Status of the conference
     * @enum "init" | "in_progress" | "completed"
     */
    status?: "init" | "in_progress" | "completed";
    /**
     * ISO 8601 formatted date of when the conference was last updated
     */
    updated_at?: string;
  }>;

  meta: Meta;
}

export type CreateConferenceRequest = {
  /**
   * Whether a beep sound should be played when participants join and/or leave the conference.
   * @default "never"
   * @enum "always" "never" "on_enter" "on_exit"
   */
  beep_enabled?: "always" | "never" | "on_enter" | "on_exit";

  /**
   * Unique identifier and token for controlling the call
   * @required
   */
  call_control_id: string;

  /**
   * Use this field to add state to every subsequent webhook. It must be a valid Base-64 encoded string. The client_state will be updated for the creator call leg and will be used for all webhooks related to the created conference.
   */
  client_state?: string;

  /**
   * Toggle background comfort noise.
   * @default true
   */
  comfort_noise?: boolean;

  /**
   * Use this field to avoid execution of duplicate commands. VOXO will ignore subsequent commands with the same command_id as one that has already been executed.
   */
  command_id?: string;

  /**
   * Time length (minutes) after which the conference will end.
   */
  duration_minutes?: number;

  /**
   * The URL of a file to be played to participants joining the conference. The URL can point to either a WAV or MP3 file. hold_media_name and hold_audio_url cannot be used together in one request. Takes effect only when "start_conference_on_create" is set to "false".
   */
  hold_audio_url?: string;

  /**
   * The media_name of a file to be played to participants joining the conference. The media_name must point to a file previously uploaded to api.voxo.com/v2/media by the same user/organization. The file must either be a WAV or MP3 file. Takes effect only when "start_conference_on_create" is set to "false".
   */
  hold_media_name?: string;

  /**
   * The maximum number of active conference participants to allow. Must be between 2 and 800.
   * @default 250
   */
  max_participants?: number;

  /**
   * Name of the conference
   * @required
   */
  name: string;

  /**
   * Whether the conference should be started on creation. If the conference isn't started all participants that join are automatically put on hold.
   * @default true
   */
  start_conference_on_create?: boolean;
};

export type CreateConferenceResponse = {
  data: {
    /**
     * Identifies the connection (Call Control App) associated with the conference
     */
    connection_id?: string;

    /**
     * ISO 8601 formatted date of when the conference was created
     */
    created_at: string;

    /**
     * Reason why the conference ended
     * @enum "all_left" "ended_via_api" "host_left" "time_exceeded"
     */
    end_reason?: "all_left" | "ended_via_api" | "host_left" | "time_exceeded";

    /**
     * IDs related to who ended the conference. It is expected for them to all be there or all be null
     */
    ended_by?: {
      id: string;
    };

    /**
     * ISO 8601 formatted date of when the conference will expire
     */
    expires_at: string;

    /**
     * Uniquely identifies the conference
     */
    id: string;

    /**
     * Name of the conference
     */
    name: string;

    /**
     * @default "conference"
     */
    record_type: "conference";

    /**
     * Region where the conference is hosted
     */
    region?: string;

    /**
     * Status of the conference
     * @enum "init" "in_progress" "completed"
     */
    status?: "init" | "in_progress" | "completed";

    /**
     * ISO 8601 formatted date of when the conference was last updated
     */
    updated_at?: string;
  };
};

export type ListConferenceParticipantsRequest = {
  /**
   * Uniquely identifies the conference by id
   */
  conference_id: string;

  /**
   * Filter object containing muted, on_hold, whispering keys
   */
  filter?: {
    /**
     * If present, participants will be filtered to those who are/are not muted
     * @example true
     */
    muted?: boolean;

    /**
     * If present, participants will be filtered to those who are/are not put on hold
     * @example false
     */
    on_hold?: boolean;

    /**
     * If present, participants will be filtered to those who are whispering or are not
     * @example true
     */
    whispering?: boolean;
  };

  /**
   * Page object containing number, size
   */
  page?: {
    /**
     * The page number to load
     * @default 1
     * @example 2
     */
    number?: number;

    /**
     * The size of the page
     * @default 20
     * @example 50
     * @min 1
     * @max 250
     */
    size?: number;
  };

  meta: Meta;
};

export type ListConferenceParticipantsResponse = {
  data: Array<{
    /** Call Control ID associated with the partiipant of the conference */
    call_control_id: string;
    /** Uniquely identifies the call leg associated with the participant */
    call_leg_id: string;
    /** Info about the conference that the participant is in */
    conference: {
      id: string;
      name: string;
    };
    /** ISO 8601 formatted date of when the participant was created */
    created_at: string;
    /** Whether the conference will end and all remaining participants be hung up after the participant leaves the conference. */
    end_conference_on_exit: boolean;
    /** Uniquely identifies the participant */
    id: string;
    /** Whether the participant is muted. */
    muted: boolean;
    /** Whether the participant is put on_hold. */
    on_hold: boolean;
    /** Value: "participant" */
    record_type: string;
    /** Whether the conference will end after the participant leaves the conference. */
    soft_end_conference_on_exit: boolean;
    /** The status of the participant with respect to the lifecycle within the conference
     * @enum {"joining", "joined", "left"}
     */
    status: "joining" | "joined" | "left";
    /** ISO 8601 formatted date of when the participant was last updated */
    updated_at: string;
    /** Array of unique call_control_ids the participant can whisper to. */
    whisper_call_control_ids: Array<string>;
  }>;

  meta: Meta;
};

export type DialParticipantRequest = {
  /**
   * Unique identifier and token for controlling the call
   * @example "call_control_id"
   */
  call_control_id: string;

  /**
   * Use this field to add state to every subsequent webhook. It must be a valid Base-64 encoded string.
   * @example "client_state"
   */
  client_state?: string;

  /**
   * Use this field to avoid execution of duplicate commands. VOXO will ignore subsequent commands with the same command_id as one that has already been executed.
   * @example "command_id"
   */
  command_id?: string;

  /**
   * The from number to be used as the caller id presented to the destination (to number).
   * @example "+19198675309"
   */
  from: string;

  /**
   * Whether the participant should be put on hold immediately after joining the conference.
   * @default false
   */
  hold?: boolean;

  /**
   * The URL of a file to be played to the participant when they are put on hold after joining the conference. If media_name is also supplied, this is currently ignored. Takes effect only when "start_conference_on_create" is set to "false". This property takes effect only if "hold" is set to "true".
   * @example "http://example.com/hold_music.mp3"
   */
  hold_audio_url?: string;

  /**
   * The media_name of a file to be played to the participant when they are put on hold after joining the conference. The media_name must point to a file previously uploaded to api.voxo.com/v2/media by the same user/organization. The file must either be a WAV or MP3 file. Takes effect only when "start_conference_on_create" is set to "false". This property takes effect only if "hold" is set to "true".
   * @example "hold_media_name"
   */
  hold_media_name?: string;

  /**
   * Whether the participant should be muted immediately after joining the conference.
   * @default false
   */
  mute?: boolean;

  /**
   * Whether the conference should be started after the participant joins the conference.
   * @default false
   */
  start_conference_on_enter?: boolean;

  /**
   * Sets the joining participant as a supervisor for the conference. A conference can have multiple supervisors. "barge" means the supervisor enters the conference as a normal participant. This is the same as "none". "monitor" means the supervisor is muted but can hear all participants. "whisper" means that only the specified "whisper_call_control_ids" can hear the supervisor. Defaults to "none".
   * @enum "barge" "monitor" "none" "whisper"
   */
  supervisor_role?: "barge" | "monitor" | "none" | "whisper";

  /**
   * The DID or SIP URI to dial out and bridge to the given call.
   * @example "+19198675309"
   */
  to: string;

  /**
   * Array of unique call_control_ids the joining supervisor can whisper to. If none provided, the supervisor will join the conference as a monitoring participant only.
   * @example ["call_control_id1", "call_control_id2"]
   */
  whisper_call_control_ids?: string[];
};

export type HoldParticipantsRequest = {
  /**
   * The URL of a file to be played to the participants when they are put on hold.
   * media_name and audio_url cannot be used together in one request.
   * @example https://example.com/audio_file.mp3
   */
  audio_url?: string;

  /**
   * List of unique identifiers and tokens for controlling the call.
   * When empty all participants will be placed on hold.
   * @example ["callControlId1", "callControlId2"]
   * @default []
   */
  call_control_ids?: string[];

  /**
   * The media_name of a file to be played to the participants when they are put on hold.
   * The media_name must point to a file previously uploaded to api.voxo.com/v2/media by the same user/organization.
   * The file must either be a WAV or MP3 file.
   * @example "hold_music"
   * @enum ["wav", "mp3"]
   */
  media_name?: string;
};

export type JoinConferenceRequest = {
  /**
   * Whether a beep sound should be played when the participant joins and/or leaves the conference. Can be used to override the conference-level setting.
   * @enum {"always", "never", "on_enter", "on_exit"}
   */
  beep_enabled?: "always" | "never" | "on_enter" | "on_exit";
  /**
   * Unique identifier and token for controlling the call
   */
  call_control_id: string;
  /**
   * Use this field to add state to every subsequent webhook. It must be a valid Base-64 encoded string. Please note that the client_state will be updated for the participient call leg and the change will not affect conferencing webhooks unless the participient is the owner of the conference.
   */
  client_state?: string;
  /**
   * Use this field to avoid execution of duplicate commands. VOXO will ignore subsequent commands with the same command_id as one that has already been executed.
   */
  command_id?: string;
  /**
   * Whether the conference should end and all remaining participants be hung up after the participant leaves the conference. Defaults to "false".
   * @default false
   */
  end_conference_on_exit?: boolean;
  /**
   * Whether the participant should be put on hold immediately after joining the conference. Defaults to "false".
   * @default false
   */
  hold?: boolean;
  /**
   * The URL of a file to be played to the participant when they are put on hold after joining the conference. hold_media_name and hold_audio_url cannot be used together in one request. Takes effect only when "start_conference_on_create" is set to "false". This property takes effect only if "hold" is set to "true".
   */
  hold_audio_url?: string;
  /**
   * The media_name of a file to be played to the participant when they are put on hold after joining the conference. The media_name must point to a file previously uploaded to api.voxo.com/v2/media by the same user/organization. The file must either be a WAV or MP3 file. Takes effect only when "start_conference_on_create" is set to "false". This property takes effect only if "hold" is set to "true".
   */
  hold_media_name?: string;
  /**
   * Whether the participant should be muted immediately after joining the conference. Defaults to "false".
   * @default false
   */
  mute?: boolean;
  /**
   * Whether the conference should end after the participant leaves the conference. NOTE this doesn't hang up the other participants. Defaults to "false".
   * @default false
   */
  soft_end_conference_on_exit?: boolean;
  /**
   * Whether the conference should be started after the participant joins the conference. Defaults to "false".
   * @default false
   */
  start_conference_on_enter?: boolean;
  /**
   * Sets the joining participant as a supervisor for the conference. A conference can have multiple supervisors. "barge" means the supervisor enters the conference as a normal participant. This is the same as "none". "monitor" means the supervisor is muted but can hear all participants. "whisper" means that only the specified "whisper_call_control_ids" can hear the supervisor. Defaults to "none".
   * @default "none"
   * @enum {"barge", "monitor", "none", "whisper"}
   */
  supervisor_role?: "barge" | "monitor" | "none" | "whisper";
  /**
   * Array of unique call_control_ids the joining supervisor can whisper to. If none provided, the supervisor will join the conference as a monitoring participant only.
   */
  whisper_call_control_ids?: string[];
};

export type LeaveConferenceRequest = {
  /**
   * Whether a beep sound should be played when the participant leaves the conference.
   * Can be used to override the conference-level setting.
   * @enum "always" "never" "on_enter" "on_exit"
   * @example "on_exit"
   */
  beep_enabled?: "always" | "never" | "on_enter" | "on_exit";

  /**
   * Unique identifier and token for controlling the call
   * @example "call_control_id"
   */
  call_control_id: string;

  /**
   * Use this field to avoid execution of duplicate commands.
   * VOXO will ignore subsequent commands with the same command_id as one that has already been executed.
   * @example "command_id"
   */
  command_id?: string;
};

export type MuteParticipantsRequest = {
  /**
   * Array of unique identifiers and tokens for controlling the call.
   * When empty all participants will be muted.
   * @example ["call_control_id_1", "call_control_id_2"]
   * @default []
   */
  call_control_ids: string[];
};

export type PlayAudioParticipantsRequest = {
  /**
   * The URL of a file to be played back in the conference.
   * media_name and audio_url cannot be used together in one request.
   * @example "https://example.com/audio.mp3"
   */
  audio_url?: string;

  /**
   * List of call control ids identifying participants the audio file should be played to.
   * If not given, the audio file will be played to the entire conference.
   * @example ["call_control_id_1", "call_control_id_2"]
   */
  call_control_ids?: string[];

  /**
   * @default 1
   * @example 3
   */
  loop?: number;

  /**
   * The media_name of a file to be played back in the conference.
   * The media_name must point to a file previously uploaded to api.voxo.com/v2/media by the same user/organization.
   * The file must either be a WAV or MP3 file.
   * @example "my_uploaded_audio"
   */
  media_name?: string;
};

export type ConferenceRecordingStartRequest = {
  /**
   * When dual, final audio file will be stereo recorded with the first leg on channel A, and the rest on channel B.
   * @enum single
   * @enum dual
   */
  channels: "single" | "dual";

  /**
   * Use this field to add state to every subsequent webhook. It must be a valid Base-64 encoded string.
   * @example "eyJzdGF0ZSI6ICJwYXJ0eSJ9"
   */
  client_state?: string;

  /**
   * Use this field to avoid duplicate commands. VOXO will ignore any command with the same command_id for the same call_control_id.
   * @example "unique-command-id"
   */
  command_id?: string;

  /**
   * The audio file format used when storing the call recording. Can be either mp3 or wav.
   * @enum wav
   * @enum mp3
   */
  format: "wav" | "mp3";

  /**
   * Defines the maximum length for the recording in seconds. The minimum value is 0. The maximum value is 14400. The default value is 0 (infinite).
   * @default 0
   * @example 3600
   */
  max_length?: number;

  /**
   * If enabled, a beep sound will be played at the start of a recording.
   * @default false
   * @example true
   */
  play_beep?: boolean;

  /**
   * The number of seconds that VOXO will wait for the recording to be stopped if silence is detected. The timer only starts when the speech is detected. The minimum value is 0. The default value is 0 (infinite).
   * @default 0
   * @example 10
   */
  timeout_secs?: number;
};

export type ConferenceRecordingStopRequest = {
  /**
   * Use this field to add state to every subsequent webhook.
   * It must be a valid Base-64 encoded string.
   * @example "My state"
   */
  client_state: string;

  /**
   * Use this field to avoid duplicate commands.
   * VOXO will ignore any command with the same command_id for the same call_control_id.
   * @example "cmd123"
   */
  command_id: string;
};

export type SpeakTextParticipantsRequest = {
  /**
   * Call Control IDs of participants who will hear the spoken text. When empty all participants will hear the spoken text.
   * @example ["call_control_id_1", "call_control_id_2"]
   */
  call_control_ids?: string[];

  /**
   * Use this field to avoid execution of duplicate commands. VOXO will ignore subsequent commands with the same command_id as one that has already been executed.
   * @example "command_id_123"
   */
  command_id?: string;

  /**
   * The language used to speak the text.
   * @required
   * @example "en-US"
   * @enum "arb" "cmn-CN" "cy-GB" "da-DK" "de-DE" "en-AU" "en-GB" "en-GB-WLS" "en-IN" "en-US" "es-ES" "es-MX" "es-US" "fr-CA" "fr-FR" "hi-IN" "is-IS" "it-IT" "ja-JP" "ko-KR" "nb-NO" "nl-NL" "pl-PL" "pt-BR" "pt-PT" "ro-RO" "ru-RU" "sv-SE" "tr-TR"
   */
  language: string;

  /**
   * The text or SSML to be converted into speech. There is a 3,000 character limit.
   * @required
   * @example "Hello, this is a test message."
   */
  payload: string;

  /**
   * The type of the provided payload. The payload can either be plain text, or Speech Synthesis Markup Language (SSML).
   * @default "text"
   * @example "text"
   * @enum "text" "ssml"
   */
  payload_type?: "text" | "ssml";

  /**
   * The gender of the voice used to speak the text.
   * @required
   * @example "female"
   * @enum "male" "female"
   */
  voice: "male" | "female";
};

export type StopAudioParticipantsRequest = {
  /**
   * List of call control ids identifying participants the audio file should stop be played to.
   * If not given, the audio will be stoped to the entire conference.
   * @example ["callctrl_12345678", "callctrl_87654321"]
   * @default Entire conference
   */
  call_control_ids?: Array<string>;
};

export type UnholdParticipantsRequest = {
  /**
   * List of unique identifiers and tokens for controlling the call. Enter each call control ID to be unheld.
   * @example ["call_control_id_1", "call_control_id_2"]
   */
  call_control_ids: Array<string>;
};

export type UnmuteParticipantsRequest = {
  /**
   * List of unique identifiers and tokens for controlling the call.
   * Enter each call control ID to be unmuted.
   * When empty all participants will be unmuted.
   * @examples ["call_control_id_1", "call_control_id_2"]
   * @defaults []
   */
  call_control_ids: string[];
};

export type UpdateParticipantsRequest = {
  /**
   * Unique identifier and token for controlling the call.
   */
  call_control_id: string;

  /**
   * Use this field to avoid execution of duplicate commands. VOXO will ignore subsequent commands with the same command_id as one that has already been executed.
   * @example "unique_command_id"
   */
  command_id?: string;

  /**
   * Sets the participant as a supervisor for the conference. A conference can have multiple supervisors. "barge" means the supervisor enters the conference as a normal participant. This is the same as "none". "monitor" means the supervisor is muted but can hear all participants. "whisper" means that only the specified "whisper_call_control_ids" can hear the supervisor. Defaults to "none".
   * @enum ["barge", "monitor", "none", "whisper"]
   * @default "none"
   */
  supervisor_role: "barge" | "monitor" | "none" | "whisper";

  /**
   * Array of unique call_control_ids the supervisor can whisper to. If none provided, the supervisor will join the conference as a monitoring participant only.
   * @example ["call_control_id_1", "call_control_id_2"]
   */
  whisper_call_control_ids?: string[];
};

export type GetQueueResponse = {
  data: {
    /**
     * The average time that the calls currently in the queue have spent waiting, given in seconds.
     */
    average_wait_time_secs: number;
    /**
     * ISO 8601 formatted date of when the queue was created
     * @example "2021-10-01T12:34:56Z"
     */
    created_at: string;
    /**
     * The number of calls currently in the queue
     * @default 0
     */
    current_size: number;
    /**
     * Uniquely identifies the queue
     * @example "abcdef123456"
     */
    id: string;
    /**
     * The maximum number of calls allowed in the queue
     */
    max_size: number;
    /**
     * Name of the queue
     */
    name: string;
    /**
     * Value: "queue"
     * @enum { "queue" }
     */
    record_type: string;
    /**
     * ISO 8601 formatted date of when the queue was last updated
     * @example "2021-10-01T12:35:00Z"
     */
    updated_at: string;
  };
};

export type ListQueueCallsRequest = {
  page?: {
    /**
     * The page number to load
     * @default 1
     * @example 2
     */
    number?: number;

    /**
     * The size of the page
     * @default 20
     * @example 50
     * @enum 1, 250
     */
    size?: number;
  };
};

export type ListQueueCallsResponse = {
  data: Array<{
    /**
     * Unique identifier and token for controlling the call.
     */
    call_control_id: string;

    /**
     * ID that is unique to the call and can be used to correlate webhook events.
     */
    call_leg_id: string;

    /**
     * ID that is unique to the call session and can be used to correlate webhook events. Call session is a group of related call legs that logically belong to the same phone call, e.g. an inbound and outbound leg of a transferred call.
     */
    call_session_id: string;

    /**
     * VOXO connection ID used in the call.
     */
    connection_id: string;

    /**
     * ISO 8601 formatted date of when the call was put in the queue.
     */
    enqueued_at: string;

    /**
     * Number or SIP URI placing the call.
     */
    from: string;

    /**
     * Unique identifier of the queue the call is in.
     */
    queue_id: string;

    /**
     * Current position of the call in the queue.
     */
    queue_position: number;

    /**
     * Value: "queue_call"
     */
    record_type: "queue_call";

    /**
     * Destination number or SIP URI of the call.
     */
    to: string;

    /**
     * The time the call has been waiting in the queue, given in seconds.
     */
    wait_time_secs: number;
  }>;

  meta: Meta;
};

export type GetQueueCallResponse = {
  data: {
    /**
     * Unique identifier and token for controlling the call.
     */
    call_control_id: string;
    /**
     * ID that is unique to the call and can be used to correlate webhook events.
     */
    call_leg_id: string;
    /**
     * ID that is unique to the call session and can be used to correlate webhook events.
     * Call session is a group of related call legs that logically belong to the same phone call,
     * e.g. an inbound and outbound leg of a transferred call.
     */
    call_session_id: string;
    /**
     * VOXO connection ID used in the call.
     */
    connection_id: string;
    /**
     * ISO 8601 formatted date of when the call was put in the queue.
     */
    enqueued_at: string;
    /**
     * Number or SIP URI placing the call.
     */
    from: string;
    /**
     * Unique identifier of the queue the call is in.
     */
    queue_id: string;
    /**
     * Current position of the call in the queue.
     */
    queue_position: number;
    /**
     * Value: "queue_call"
     * @enum {string}
     */
    record_type: "queue_call";
    /**
     * Destination number or SIP URI of the call.
     */
    to: string;
    /**
     * The time the call has been waiting in the queue, given in seconds.
     */
    wait_time_secs: number;
  };

  meta: Meta;
};

export type GetFaxResponse = {
  data: {
    connection_id: string; // The ID of the connection used to send the fax.
    created_at: string; // ISO 8601 timestamp when resource was created
    direction: "inbound" | "outbound"; // The direction of the fax. @enum: "inbound", "outbound"
    from: string; // The phone number, in E.164 format, the fax will be sent from.
    id: string; // Identifies the resource.
    media_name: string; // The media_name used for the fax's media. Must point to a file previously uploaded to api.voxo.com/v2/media by the same user/organization. media_name and media_url/contents can't be submitted together.
    media_url: string; // The URL to the PDF used for the fax's media. media_url and media_name/contents can't be submitted together.
    quality: "normal" | "high" | "very_high"; // The quality of the fax. Can be normal, high, very_high @default: "high"
    record_type: "fax"; // Identifies the type of the resource. @value: "fax"
    status:
      | "queued"
      | "media.processed"
      | "originated"
      | "sending"
      | "delivered"
      | "failed"
      | "initiated"
      | "receiving"
      | "media.processing"
      | "received"; // Status of the fax. @enum: "queued", "media.processed", "originated", "sending", "delivered", "failed", "initiated", "receiving", "media.processing", "received"
    store_media: boolean; // Should fax media be stored on temporary URL. It does not support media_name.
    stored_media_url: string; // If store_media was set to true, this is a link to temporary location. Link expires after 10 minutes.
    to: string; // The phone number, in E.164 format, the fax will be sent to or SIP URI
    updated_at: string; // ISO 8601 timestamp when resource was updated
    webhook_failover_url: string; // Optional failover URL that will receive fax webhooks if webhook_url doesn't return a 2XX response
    webhook_url: string; // URL that will receive fax webhooks
  };
};
