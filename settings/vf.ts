import axios from 'axios'


export class Voiceflow {
    public axios: any
    constructor(public apiKey: string) {
        this.axios = axios.create({
            baseURL: 'https://general-runtime.voiceflow.com',
            headers: {
              Authorization: this.apiKey,
            },
            method: 'POST',
        });
    }

    public tidyResponse(response: (VFText | VFVisual | VFChoice)[]): TransformedResponse[] {
        const responses:({ type: TypeKeys, value: string} | 
                         {type: TypeKeys, value: string[]})[] = []
                         
        const choices: {type: TypeKeys, value: string[]}[] = []
        response.forEach(item => {
            const { type } = item
            
            if (item.type === 'text') {
                responses.push({ type, value: item.payload.message })
            }

            if (item.type === 'choice') {
                const buttons = item.payload.buttons.map(button => {
                    const { request } = button
                    return request.payload
                })
                choices.push({ type, value: buttons })
            }

            if (item.type === 'visual') {
                if (item.payload.visualType === 'image') {
                    const { image } = item.payload
                    responses.push({ type, value: image })
                }
            }
        })
        return responses.concat(choices)
    }

    public async send(sessionId: string, message: string, payload: any = {}): Promise<TransformedResponse[]>{ 
        const response = await this._send(sessionId, message, payload)
        return this.tidyResponse(response)
    }

    public async _send(sessionId: string, message: string, payload: any = {}){ 
        const data = {
            action: {
              type: 'text',
              payload: message,
            },
            ...payload
        }

        const response = await this.axios({
            url: `/state/user/${sessionId}/interact`,
            data,
          });
          return response.data
    }

    public async launch(sessionId): Promise<TransformedResponse[]> {
      const response = await this.axios({
        url: `/state/user/${sessionId}/interact`,
        data: { type: 'launch '},
      })
      return this.tidyResponse(response.data)
    }

}

// todo: more response types, dialogflow?
export type TypeKeys = 'text' | 'choice' | 'visual'
export interface TransformedResponse {
    type: TypeKeys;
    value: string | string[];
}

export interface VFVisual {
    visualType: string;
    image: string;
    device?: any;
    dimensions: any;
    canvasVisibility: string;
}

export interface Base<T> {
    "type": string
    "payload": T
}
export interface VFText extends Base<{ message: string, slate: { id: string, content: {children: {text: string}[] }} }> {
    "type": "text"
}

export interface VFVisual extends Base<{ visualType: string; image: string; device?: any; dimensions: { width: number; height: number; }; canvasVisibility: string; }> {
    "type": "visual"
}

export interface VFButton {
    name: string;
    request: { 
        type: string
        payload: string 
    } 
}
export interface VFChoice extends Base<{ buttons: VFButton[]}> {
    "type": "choice"
}

export type VFInteraction = VFText | VFVisual | VFChoice

// { type: 'path', payload: [Object] },
// { type: 'text', payload: [Object] },
// { type: 'choice', payload: [Object] }
// { type: 'path', payload: [Object] },
// { type: 'text', payload: [Object] },
// { type: 'visual', payload: [Object] },
// { type: 'end' }

/**
 * 
 * 
 * 

## Text + Visual 

[
  {
    "type": "path",
    "payload": {
      "path": "jump"
    }
  },
  {
    "type": "text",
    "payload": {
      "slate": {
        "id": "bw3r3bw4",
        "content": [
          {
            "children": [
              {
                "text": "Here's a "
              },
              {
                "text": "large"
              },
              {
                "text": " "
              },
              {
                "text": "mint"
              },
              {
                "text": " "
              }
            ]
          }
        ]
      },
      "message": "Here's a large mint"
    }
  },
  {
    "type": "visual",
    "payload": {
      "visualType": "image",
      "image": "https://s3.amazonaws.com/com.getstoryflow.api.images/1646211236829-mint.jpg",
      "device": null,
      "dimensions": {
        "width": 1050,
        "height": 701
      },
      "canvasVisibility": "full"
    }
  },
  {
    "type": "end"
  }
]

## Text + Buttons

[
  {
    "type": "path",
    "payload": {
      "path": "jump"
    }
  },
  {
    "type": "text",
    "payload": {
      "slate": {
        "id": "ytyj3e4f",
        "content": [
          {
            "children": [
              {
                "text": "Alright what can I get you?"
              }
            ]
          }
        ]
      },
      "message": "Alright what can I get you?"
    }
  },
  {
    "type": "choice",
    "payload": {
      "buttons": [
        {
          "name": "vanilla",
          "request": {
            "type": "text",
            "payload": "vanilla"
          }
        },
        {
          "name": "chocolate",
          "request": {
            "type": "text",
            "payload": "chocolate"
          }
        },
        {
          "name": "mint",
          "request": {
            "type": "text",
            "payload": "mint"
          }
        },
        {
          "name": "strawberry",
          "request": {
            "type": "text",
            "payload": "strawberry"
          }
        },
        {
          "name": "broccoli",
          "request": {
            "type": "text",
            "payload": "broccoli"
          }
        }
      ]
    }
  }
]

 *
 * 
 */