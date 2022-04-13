import axios from 'axios'
import {BotInst, loud} from 'speedybot'

export class Voiceflow {
  public axios: any
  constructor(public apiKey: string, public botRef?: BotInst) {
    this.axios = axios.create({
      baseURL: 'https://general-runtime.voiceflow.com',
      headers: {
        Authorization: this.apiKey,
      },
      method: 'POST',
    })
  }

  public tidyResponse(
    response: (VFText | VFVisual | VFChoice)[],
  ): TransformedResponse[] {
    const responses: (
      | {type: TypeKeys; value: string}
      | {type: TypeKeys; value: string[]}
    )[] = []

    const choices: {type: TypeKeys; value: string[]}[] = []
    response.forEach((item) => {
      const {type} = item

      if (item.type === 'text') {
        responses.push({type, value: item.payload.message})
      }

      if (item.type === 'choice') {
        const buttons = item.payload.buttons.map((button) => {
          const {request} = button
          return request.payload
        })
        choices.push({type, value: buttons})
      }

      if (item.type === 'visual') {
        if (item.payload.visualType === 'image') {
          const {image} = item.payload
          responses.push({type, value: image})
        }
      }
    })
    return responses.concat(choices)
  }

  public async send(
    sessionId: string,
    message: string,
    payload: any = {},
  ): Promise<TransformedResponse[]> {
    const response = await this._send(sessionId, message, payload)
    return this.tidyResponse(response)
  }

  public async _send(sessionId: string, message: string, payload: any = {}) {
    const data = {
      action: {
        type: 'text',
        payload: message,
      },
      ...payload,
    }

    const response = await this.axios({
      url: `/state/user/${sessionId}/interact`,
      data,
    }).catch((err) => this.handleErr(err))

    return response.data
  }

  public async launch(sessionId): Promise<TransformedResponse[]> {
    const response = await this.axios({
      url: `/state/user/${sessionId}/interact`,
      data: {type: 'launch '},
    }).catch((err) => this.handleErr(err))
    return this.tidyResponse(response.data)
  }

  handleErr(err: any) {
    // console.log('#', err)
    const {status = 500} = err?.response
    if (status === 500) {
      const msg = `It appears your Voiceflow API token is not set or is expired. See settings/voiceflow.json`

      if (this.botRef) {
        this.botRef.say(msg)
      } else {
        loud(msg)
      }
    }
  }
}

// todo: more response types, dialogflow?
export type TypeKeys = 'text' | 'choice' | 'visual'
export interface TransformedResponse {
  type: TypeKeys
  value: string | string[]
}

export interface VFVisual {
  visualType: string
  image: string
  device?: any
  dimensions: any
  canvasVisibility: string
}

export interface Base<T> {
  type: string
  payload: T
}
export interface VFText
  extends Base<{
    message: string
    slate: {id: string; content: {children: {text: string}[]}}
  }> {
  type: 'text'
}

export interface VFVisual
  extends Base<{
    visualType: string
    image: string
    device?: any
    dimensions: {width: number; height: number}
    canvasVisibility: string
  }> {
  type: 'visual'
}

export interface VFButton {
  name: string
  request: {
    type: string
    payload: string
  }
}
export interface VFChoice extends Base<{buttons: VFButton[]}> {
  type: 'choice'
}

export type VFInteraction = VFText | VFVisual | VFChoice
