'use client'

interface ControlPanelProps {
  axes: [number, number, number, number, number, number]
  onChange: (index: number, value: number) => void
  onReset: () => void
}

export function ControlPanel({ axes, onChange, onReset }: ControlPanelProps) {
  const axisConfigs = [
    { label: 'Axis 1 (Tool Y)', min: -Math.PI, max: Math.PI, color: 'bg-orange-500' },
    { label: 'Axis 2 (Tool Z)', min: -Math.PI, max: Math.PI, color: 'bg-red-500' },
    { label: 'Axis 3 (Wrist X)', min: -Math.PI / 2, max: Math.PI / 2, color: 'bg-red-500' },
    { label: 'Axis 4 (Elbow X)', min: -Math.PI / 2, max: Math.PI / 2, color: 'bg-blue-500' },
    { label: 'Axis 5 (Shoulder X)', min: -Math.PI / 2, max: Math.PI / 2, color: 'bg-blue-500' },
    { label: 'Axis 6 (Base Y)', min: -Math.PI, max: Math.PI, color: 'bg-gray-700' }
  ]

  const toDegrees = (rad: number) => ((rad * 180) / Math.PI).toFixed(0)

  return (
    <div className="absolute left-0 top-0 flex h-full w-100 flex-col justify-between bg-white/95 p-6 shadow-xl backdrop-blur-sm z-9">
      <div>
        <h2 className="mb-6 text-2xl font-bold text-gray-800">Robot Control</h2>
        <div className="space-y-6">
          {axisConfigs.map((config, index) => (
            <div key={index} className="flex flex-col gap-2">
              <div className="flex items-center justify-between gap-4">
                <label className="text-sm font-semibold text-gray-700 min-w-[140px]">
                  {config.label}
                </label>
                <span className={`rounded px-3 py-1 text-sm font-mono font-bold text-white ${config.color}`}>
                  {toDegrees(axes[index])}°
                </span>
              </div>
              <input
                type="range"
                min={config.min}
                max={config.max}
                step={0.01}
                value={axes[index]}
                onChange={(e) => onChange(index, parseFloat(e.target.value))}
                className="h-2 w-full cursor-pointer appearance-none rounded-lg bg-gray-300 accent-blue-600"
              />
              <div className="flex justify-between text-xs text-gray-500">
                <span>{toDegrees(config.min)}°</span>
                <span>{toDegrees(config.max)}°</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <button
        onClick={onReset}
        className="mt-6 w-full rounded-lg bg-blue-600 px-4 py-3 font-semibold text-white transition-colors hover:bg-blue-700 active:bg-blue-800"
      >
        Reset All Axes
      </button>
    </div>
  )
}
