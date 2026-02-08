'use client'

import { useState } from 'react'

interface AnalysisResult {
  id?: string
  imageUrl: string
  overlayUrl: string | null
  stats: {
    detected_defects: number
    confidence: number
    processing_time_ms: number
    regions?: Array<{ type: string; area: number }>
  }
  status: string
  error?: string
  details?: string
}

export default function AnalysisInterface() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<AnalysisResult | null>(null)
  const [error, setError] = useState<string | null>(null)

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setSelectedFile(file)
      setError(null)
      setResult(null)
      
      // Create preview
      const reader = new FileReader()
      reader.onloadend = () => {
        setPreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleAnalyze = async () => {
    if (!selectedFile) {
      setError('Please select an image first')
      return
    }

    setLoading(true)
    setError(null)
    setResult(null)

    try {
      const formData = new FormData()
      formData.append('image', selectedFile)

      const response = await fetch('/api/analyze', {
        method: 'POST',
        body: formData,
      })

      const data = await response.json()

      // Always set result, even if there's an error
      if (!response.ok) {
        setError(data.error || 'Analysis failed')
        if (data.stats) {
          setResult(data)
        }
      } else {
        setResult(data)
      }
    } catch (err: any) {
      console.error('Analysis error:', err)
      setError(err.message || 'Failed to analyze image. Please try again.')
      setResult({
        imageUrl: preview || '',
        overlayUrl: null,
        stats: {
          detected_defects: 0,
          confidence: 0,
          processing_time_ms: 0
        },
        status: 'error'
      })
    } finally {
      setLoading(false)
    }
  }

  const handleReset = () => {
    setSelectedFile(null)
    setPreview(null)
    setResult(null)
    setError(null)
  }

  return (
    <div className="flex flex-col">
      <h2 className="text-2xl font-bold mb-4">Image Analysis</h2>

      {error && (
        <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
          <p className="font-semibold">Error:</p>
          <p>{error}</p>
          {result?.details && <p className="text-sm mt-2">{result.details}</p>}
          {(error.includes('environment') || error.includes('configured') || error.includes('Database') || error.includes('configuration')) && (
            <p className="text-sm mt-2">
              💡 Need help? Check the{' '}
              <a href="/debug" className="underline font-semibold hover:text-red-900">
                diagnostics page
              </a>{' '}
              for configuration status.
            </p>
          )}
        </div>
      )}

      {!result ? (
        <div className="space-y-4">
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
            <input
              type="file"
              accept="image/*"
              onChange={handleFileSelect}
              className="hidden"
              id="file-upload"
            />
            <label
              htmlFor="file-upload"
              className="cursor-pointer inline-block px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Choose Image
            </label>
            <p className="mt-4 text-gray-600">
              Select an image to analyze for coating defects
            </p>
          </div>

          {preview && (
            <div className="space-y-4">
              <div className="border border-gray-300 rounded-lg p-4">
                <h3 className="font-semibold mb-2">Preview:</h3>
                <img
                  src={preview}
                  alt="Preview"
                  className="max-w-full h-auto max-h-96 mx-auto rounded"
                />
              </div>
              <div className="flex gap-4 justify-center">
                <button
                  onClick={handleAnalyze}
                  disabled={loading}
                  className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
                >
                  {loading ? 'Analyzing...' : 'Analyze Image'}
                </button>
                <button
                  onClick={handleReset}
                  disabled={loading}
                  className="px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
                >
                  Reset
                </button>
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="border border-gray-300 rounded-lg p-4">
              <h3 className="font-semibold mb-2">Original Image:</h3>
              <img
                src={result.imageUrl || preview || ''}
                alt="Original"
                className="max-w-full h-auto max-h-64 mx-auto rounded"
              />
            </div>
            {result.overlayUrl ? (
              <div className="border border-gray-300 rounded-lg p-4">
                <h3 className="font-semibold mb-2">Analysis Overlay:</h3>
                <img
                  src={result.overlayUrl}
                  alt="Overlay"
                  className="max-w-full h-auto max-h-64 mx-auto rounded"
                />
              </div>
            ) : (
              <div className="border border-gray-300 rounded-lg p-4 flex items-center justify-center bg-gray-50">
                <div className="text-center text-gray-500">
                  <p className="font-semibold">No overlay available</p>
                  <p className="text-sm mt-2">Analysis completed without overlay generation</p>
                </div>
              </div>
            )}
          </div>

          <div className="border border-gray-300 rounded-lg p-4 bg-gray-50">
            <h3 className="font-semibold mb-3">Analysis Results:</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-white p-4 rounded-lg border border-gray-200">
                <p className="text-sm text-gray-600">Detected Defects</p>
                <p className="text-2xl font-bold text-blue-600">
                  {result.stats.detected_defects}
                </p>
              </div>
              <div className="bg-white p-4 rounded-lg border border-gray-200">
                <p className="text-sm text-gray-600">Confidence</p>
                <p className="text-2xl font-bold text-green-600">
                  {(result.stats.confidence * 100).toFixed(1)}%
                </p>
              </div>
              <div className="bg-white p-4 rounded-lg border border-gray-200">
                <p className="text-sm text-gray-600">Processing Time</p>
                <p className="text-2xl font-bold text-purple-600">
                  {result.stats.processing_time_ms}ms
                </p>
              </div>
            </div>
            {result.stats.regions && result.stats.regions.length > 0 && (
              <div className="mt-4">
                <h4 className="font-semibold mb-2">Detected Regions:</h4>
                <div className="space-y-1">
                  {result.stats.regions.map((region, idx) => (
                    <div key={idx} className="text-sm bg-white p-2 rounded border border-gray-200">
                      <span className="font-medium">{region.type}</span>: {region.area.toFixed(0)}px²
                    </div>
                  ))}
                </div>
              </div>
            )}
            <div className="mt-4">
              <p className="text-sm">
                <span className="font-semibold">Status:</span>{' '}
                <span className={result.status.includes('completed') ? 'text-green-600' : 'text-red-600'}>
                  {result.status}
                </span>
              </p>
            </div>
          </div>

          <button
            onClick={handleReset}
            className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Analyze Another Image
          </button>
        </div>
      )}
    </div>
  )
}
