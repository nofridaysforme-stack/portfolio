import { getPayload as getPayloadInstance } from 'payload'
import config from '@/payload/payload.config'

/**
 * Get the Payload CMS instance
 * This should only be called on the server side
 */
export async function getPayload() {
  return await getPayloadInstance({
    config,
  })
}
