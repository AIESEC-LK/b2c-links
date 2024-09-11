'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ExternalLink } from 'lucide-react'

const products = {
  signups: { oGV: 'volunteer', oGTa: 'talent', oGTe: 'teach' },
  presignups: { oGV: 'volunteer', oGTa: 'talent', oGTe: 'teacher' }
}

const entities = { CC: 'Colombo Central', CN: 'Colombo North' }

const campaignSources = ['Blog', 'Classroom', 'Email', 'Facebook', 'Friend', 'Instagram', 'Linkedin', 'Official Media', 'Website']
const campaignMediums = ['Blog', 'Email', 'Offline Marketing', 'Organic Social Media', 'Paid Social Media', 'Partner Posts', 'Stories', 'University Posts']
const campaignContents = ['General', 'GT', 'GV']

export function LinkGenerator() {
  const [platformType, setPlatformType] = useState('signups')
  const [product, setProduct] = useState('')
  const [entity, setEntity] = useState('')
  const [campaignTag, setCampaignTag] = useState('LK-')
  const [campaignSource, setCampaignSource] = useState('')
  const [campaignMedium, setCampaignMedium] = useState('')
  const [campaignTerm, setCampaignTerm] = useState('')
  const [campaignContent, setCampaignContent] = useState('')
  const [generatedLink, setGeneratedLink] = useState('')
  const [errorMessage, setErrorMessage] = useState('')

  const generateLink = () => {
    setErrorMessage('')

    if (!product || !entity) {
      setErrorMessage("Product and Entity are required fields.")
      return
    }

    const baseUrl = platformType === 'signups' ? 'signup.aiesec.lk' : 'apply.aiesec.lk'
    const entityParam = platformType === 'signups' ? 'ley' : 'entity'
    let link = `${baseUrl}/${products[platformType][product]}?${entityParam}=${entity}`

    const campaignFields = [
      { key: 'campaign_tag', value: campaignTag },
      { key: 'campaign_source_id', value: campaignSource },
      { key: 'campaign_medium_id', value: campaignMedium },
      { key: 'campaign_term', value: campaignTerm },
      { key: 'campaign_content', value: campaignContent }
    ]

    const filledCampaignFields = campaignFields.filter(field => field.value)

    if (filledCampaignFields.length > 0) {
      if (filledCampaignFields.length !== campaignFields.length) {
        setErrorMessage("All campaign fields must be filled if any are filled.")
        return
      }
      if (!campaignTag.startsWith('LK-')) {
        setErrorMessage("Campaign Tag must start with 'LK-'.")
        return
      }
      link += '&' + filledCampaignFields.map(field => `${field.key}=${encodeURIComponent(field.value)}`).join('&')
    }

    setGeneratedLink(link)
  }

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generatedLink)
    alert("Link copied to clipboard!")
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <Card className="w-full max-w-md mx-auto bg-white shadow-lg">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center text-gray-800">B2C Platform Link Generator</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {errorMessage && (
            <div className="p-3 bg-red-100 border border-red-400 text-red-700 rounded-md">
              {errorMessage}
            </div>
          )}

          <div className="space-y-2">
            <Label className="text-gray-700">Platform Type</Label>
            <RadioGroup defaultValue="signups" onValueChange={setPlatformType} className="flex space-x-4">
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="signups" id="signups" />
                <Label htmlFor="signups" className="text-gray-600">Signups</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="presignups" id="presignups" />
                <Label htmlFor="presignups" className="text-gray-600">Pre-Signups</Label>
              </div>
            </RadioGroup>
          </div>

          <div className="space-y-2">
            <Label htmlFor="product" className="text-gray-700">Product *</Label>
            <Select onValueChange={setProduct} value={product}>
              <SelectTrigger id="product" className="bg-white">
                <SelectValue placeholder="Select Product" />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(products[platformType]).map(([key, value]) => (
                  <SelectItem key={key} value={key}>{value}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="entity" className="text-gray-700">Entity *</Label>
            <Select onValueChange={setEntity} value={entity}>
              <SelectTrigger id="entity" className="bg-white">
                <SelectValue placeholder="Select Entity" />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(entities).map(([key, value]) => (
                  <SelectItem key={key} value={key}>{value}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="campaign-fields">
              <AccordionTrigger className="text-gray-700">Campaign Fields (Optional)</AccordionTrigger>
              <AccordionContent>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="campaignTag" className="text-gray-700">Campaign Tag</Label>
                    <Input 
                      id="campaignTag" 
                      placeholder="Campaign Tag" 
                      value={campaignTag} 
                      onChange={(e) => setCampaignTag(e.target.value)}
                      className="bg-white"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="campaignSource" className="text-gray-700">Campaign Source</Label>
                    <Select onValueChange={setCampaignSource} value={campaignSource}>
                      <SelectTrigger id="campaignSource" className="bg-white">
                        <SelectValue placeholder="Campaign Source" />
                      </SelectTrigger>
                      <SelectContent>
                        {campaignSources.map((source) => (
                          <SelectItem key={source} value={source}>{source}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="campaignMedium" className="text-gray-700">Campaign Medium</Label>
                    <Select onValueChange={setCampaignMedium} value={campaignMedium}>
                      <SelectTrigger id="campaignMedium" className="bg-white">
                        <SelectValue placeholder="Campaign Medium" />
                      </SelectTrigger>
                      <SelectContent>
                        {campaignMediums.map((medium) => (
                          <SelectItem key={medium} value={medium}>{medium}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="campaignContent" className="text-gray-700">Campaign Content</Label>
                    <Select onValueChange={setCampaignContent} value={campaignContent}>
                      <SelectTrigger id="campaignContent" className="bg-white">
                        <SelectValue placeholder="Campaign Content" />
                      </SelectTrigger>
                      <SelectContent>
                        {campaignContents.map((content) => (
                          <SelectItem key={content} value={content}>{content}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="campaignTerm" className="text-gray-700">Campaign Term</Label>
                    <Input id="campaignTerm" placeholder="Campaign Term" value={campaignTerm} onChange={(e) => setCampaignTerm(e.target.value)} className="bg-white" />
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>

          <Button onClick={generateLink} className="w-full bg-blue-600 hover:bg-blue-700 text-white">Generate Link</Button>

          {generatedLink && (
            <div className="mt-4 p-4 bg-gray-100 rounded-md">
              <p className="text-sm font-medium text-gray-700 mb-2">Generated Link:</p>
              <p className="text-xs break-all mb-2 text-gray-600">{generatedLink}</p>
              <Button onClick={copyToClipboard} variant="outline" size="sm" className="w-full bg-white text-gray-700 border-gray-300 hover:bg-gray-50">
                Copy to Clipboard
              </Button>
            </div>
          )}

          <div className="mt-6 p-4 bg-gray-100 rounded-md">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Learn More About B2C Platforms</h3>
            <p className="text-sm text-gray-600 mb-2">
              Discover more about our B2C platforms and how they can benefit your organization.
            </p>
            <a 
              href="https://example.com/b2c-platforms-presentation" 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex items-center text-blue-600 hover:text-blue-800"
            >
              View Presentation <ExternalLink className="ml-1 h-4 w-4" />
            </a>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}