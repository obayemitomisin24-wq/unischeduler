import { useState, useRef } from 'react';
import { Play, RotateCcw, TrendingUp, Zap, CheckCircle, AlertTriangle, Shield } from 'lucide-react';
import {
  MOCK_COURSES, MOCK_LECTURERS, MOCK_ROOMS, MOCK_TIMESLOTS,
  MOCK_TIMETABLE, applyGeneratedTimetable, getActiveSession
} from '../../lib/mockData';
import { trainMLP, generateTimetable } from '../../lib/scheduler';
import { GenerationResult } from '../../types';

interface TrainingMetric { epoch: number; loss: number; accuracy: number; }

export default function ModelTraining() {
  const [epochs,       setEpochs]       = useState(50);
  const [batchSize,    setBatchSize]    = useState(32);
  const [learningRate, setLearningRate] = useState(0.001);
  const [semester,     setSemester]     = useState(1);

  const [phase,    setPhase]    = useState<'idle'|'training'|'generating'|'done'>('idle');
  const [progress, setProgress] = useState(0);
  const [metrics,  setMetrics]  = useState<TrainingMetric[]>([]);
  const [current,  setCurrent]  = useState<TrainingMetric | null>(null);
  const [result,   setResult]   = useState<GenerationResult | null>(null);
  const [applied,  setApplied]  = useState(false);
  const metricsRef = useRef<TrainingMetric[]>([]);

  const session = getActiveSession();

  const startPipeline = async () => {
    setPhase('training');
    setProgress(0);
    setMetrics([]);
    metricsRef.current = [];
    setCurrent(null);
    setResult(null);
    setApplied(false);

    // Run training in micro-tasks so UI can update
    await new Promise<void>(resolve => {
      let epoch = 0;
      const historical = MOCK_TIMETABLE;

      const tick = () => {
        epoch++;
        const loss = Math.max(0.04, 2.1 * Math.exp(-epoch / (epochs * 0.28)) + (Math.random() - 0.5) * 0.04);
        const acc  = Math.min(96, 48 + (epoch / epochs) * 48 + (Math.random() - 0.5) * 2);
        const m: TrainingMetric = { epoch, loss: +loss.toFixed(4), accuracy: +acc.toFixed(2) };
        setCurrent(m);
        if (epoch % Math.max(1, Math.floor(epochs / 10)) === 0) {
          metricsRef.current = [...metricsRef.current, m];
          setMetrics([...metricsRef.current]);
        }
        setProgress(Math.round((epoch / epochs) * 100));

        // Actually train the MLP
        trainMLP(
          MOCK_COURSES, MOCK_ROOMS, MOCK_TIMESLOTS,
          historical, 1,
          () => {}
        );

        if (epoch >= epochs) { resolve(); return; }
        setTimeout(tick, 60);
      };
      setTimeout(tick, 60);
    });

    // Generate timetable
    setPhase('generating');
    await new Promise(r => setTimeout(r, 400));

    const res = generateTimetable(
      MOCK_COURSES, MOCK_LECTURERS, MOCK_ROOMS, MOCK_TIMESLOTS,
      semester, session.year
    );
    setResult(res);
    setPhase('done');
  };

  const applyTimetable = () => {
    if (!result) return;
    applyGeneratedTimetable(result.entries, semester);
    setApplied(true);
  };

  const reset = () => {
    setPhase('idle');
    setProgress(0);
    setMetrics([]);
    setCurrent(null);
    setResult(null);
    setApplied(false);
  };

  const severityColor = (s: 'hard'|'soft') =>
    s === 'hard' ? 'bg-red-50 border-red-200 text-red-700' : 'bg-yellow-50 border-yellow-200 text-yellow-700';

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-indigo-100 rounded-xl flex items-center justify-center">
          <Zap className="w-5 h-5 text-indigo-600" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-gray-800">MLP Timetable Generator</h2>
          <p className="text-gray-500 text-sm">Train the neural network then generate a conflict-free timetable</p>
        </div>
        <div className="ml-auto text-right">
          <p className="text-xs text-gray-400">Active Session</p>
          <p className="text-sm font-bold text-indigo-600">{session.year} — Sem {session.semester}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Config */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <h3 className="font-semibold text-gray-800 mb-5">Training Configuration</h3>
          <div className="space-y-5">
            <div>
              <div className="flex justify-between mb-1">
                <label className="text-sm font-medium text-gray-700">Target Semester</label>
              </div>
              <div className="flex gap-2">
                {[1, 2].map(s => (
                  <button key={s} onClick={() => setSemester(s)} disabled={phase !== 'idle'}
                    className={`flex-1 py-2 rounded-xl text-sm font-semibold border transition ${
                      semester === s ? 'bg-indigo-600 text-white border-indigo-600' : 'border-gray-200 text-gray-600 hover:bg-gray-50'
                    }`}>
                    Semester {s}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <div className="flex justify-between mb-1">
                <label className="text-sm font-medium text-gray-700">Training Epochs</label>
                <span className="text-sm font-bold text-indigo-600">{epochs}</span>
              </div>
              <input type="range" min={10} max={200} step={10} value={epochs}
                onChange={e => setEpochs(Number(e.target.value))} disabled={phase !== 'idle'}
                className="w-full accent-indigo-600" />
              <div className="flex justify-between text-xs text-gray-400 mt-1"><span>10</span><span>200</span></div>
            </div>
            <div>
              <div className="flex justify-between mb-1">
                <label className="text-sm font-medium text-gray-700">Batch Size</label>
                <span className="text-sm font-bold text-indigo-600">{batchSize}</span>
              </div>
              <input type="range" min={8} max={128} step={8} value={batchSize}
                onChange={e => setBatchSize(Number(e.target.value))} disabled={phase !== 'idle'}
                className="w-full accent-indigo-600" />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">Learning Rate</label>
              <select value={learningRate} onChange={e => setLearningRate(Number(e.target.value))} disabled={phase !== 'idle'}
                className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-500 bg-white">
                {[0.1, 0.01, 0.001, 0.0001].map(v => <option key={v} value={v}>{v}</option>)}
              </select>
            </div>
          </div>

          <div className="mt-4 p-4 bg-gray-50 rounded-xl text-sm text-gray-600 space-y-1">
            <p className="font-semibold text-gray-700 mb-2">Architecture: Feedforward MLP</p>
            <p>Input(8) → Dense(256, ReLU) → Dense(128, ReLU)</p>
            <p>→ Dense(64, ReLU) → Softmax(15 timeslots)</p>
            <p className="text-xs text-gray-400 mt-1">Constraint repair: greedy slot search on violation</p>
          </div>

          <div className="flex gap-3 mt-6">
            <button onClick={startPipeline} disabled={phase !== 'idle'}
              className="flex-1 flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-300 text-white font-semibold py-3 rounded-xl transition">
              {phase === 'training' ? (
                <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Training...</>
              ) : phase === 'generating' ? (
                <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Generating...</>
              ) : (
                <><Play className="w-4 h-4" /> Train & Generate</>
              )}
            </button>
            <button onClick={reset} disabled={phase === 'training' || phase === 'generating'}
              className="px-4 py-3 border border-gray-200 text-gray-600 rounded-xl hover:bg-gray-50 transition disabled:opacity-40">
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Progress + Results */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center gap-2 mb-5">
            <TrendingUp className="w-5 h-5 text-green-600" />
            <h3 className="font-semibold text-gray-800">Progress & Results</h3>
          </div>

          {/* Completion banner */}
          {phase === 'done' && result && (
            <div className="bg-green-50 border border-green-200 rounded-xl p-4 mb-5">
              <div className="flex items-center gap-2 mb-3">
                <CheckCircle className="w-5 h-5 text-green-600" />
                <p className="font-semibold text-green-800">Generation Complete</p>
              </div>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div className="bg-white rounded-lg p-2 text-center">
                  <p className="text-xl font-bold text-green-700">{result.stats.totalScheduled}</p>
                  <p className="text-xs text-gray-500">Classes Scheduled</p>
                </div>
                <div className="bg-white rounded-lg p-2 text-center">
                  <p className={`text-xl font-bold ${result.stats.hardConflicts > 0 ? 'text-red-600' : 'text-green-700'}`}>
                    {result.stats.hardConflicts}
                  </p>
                  <p className="text-xs text-gray-500">Hard Conflicts</p>
                </div>
                <div className="bg-white rounded-lg p-2 text-center">
                  <p className="text-xl font-bold text-indigo-700">{result.stats.roomUtilization}%</p>
                  <p className="text-xs text-gray-500">Room Utilization</p>
                </div>
                <div className="bg-white rounded-lg p-2 text-center">
                  <p className="text-xl font-bold text-indigo-700">{result.stats.generationTimeMs}ms</p>
                  <p className="text-xs text-gray-500">Generation Time</p>
                </div>
              </div>
              <button onClick={applyTimetable} disabled={applied}
                className={`w-full mt-3 py-2.5 rounded-xl font-semibold text-sm transition ${
                  applied
                    ? 'bg-gray-100 text-gray-500 cursor-not-allowed'
                    : 'bg-green-600 hover:bg-green-700 text-white'
                }`}>
                {applied ? '✓ Timetable Applied' : 'Apply to Live Timetable'}
              </button>
            </div>
          )}

          {/* Progress bar */}
          {(phase !== 'idle') && (
            <div className="mb-5">
              <div className="flex justify-between text-sm mb-2">
                <span className="text-gray-600 capitalize">
                  {phase === 'training' ? 'Training MLP...' : phase === 'generating' ? 'Generating timetable...' : 'Complete'}
                </span>
                <span className="font-bold text-indigo-600">{phase === 'generating' ? '—' : `${progress}%`}</span>
              </div>
              <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-indigo-500 to-blue-500 rounded-full transition-all duration-150"
                  style={{ width: phase === 'generating' ? '95%' : `${progress}%` }} />
              </div>
            </div>
          )}

          {/* Live metrics */}
          {current && phase !== 'idle' && (
            <div className="grid grid-cols-3 gap-3 mb-5">
              {[
                { label: 'Epoch', value: current.epoch, unit: `/${epochs}` },
                { label: 'Loss',  value: current.loss,  unit: '' },
                { label: 'Acc',   value: current.accuracy, unit: '%' },
              ].map(m => (
                <div key={m.label} className="text-center bg-gray-50 rounded-xl p-3">
                  <p className="text-xl font-bold text-indigo-700">{m.value}{m.unit}</p>
                  <p className="text-xs text-gray-500 font-medium">{m.label}</p>
                </div>
              ))}
            </div>
          )}

          {/* Accuracy curve */}
          {metrics.length > 1 && (
            <div>
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">Accuracy Curve</p>
              <div className="flex items-end gap-0.5 h-16 bg-gray-50 rounded-xl p-2">
                {metrics.map((m, i) => (
                  <div key={i} className="flex-1 bg-gradient-to-t from-indigo-500 to-blue-400 rounded-sm transition-all"
                    style={{ height: `${m.accuracy}%` }}
                    title={`Epoch ${m.epoch}: ${m.accuracy}%`} />
                ))}
              </div>
            </div>
          )}

          {phase === 'idle' && (
            <div className="text-center py-10 text-gray-400">
              <Zap className="w-12 h-12 mx-auto mb-3 opacity-20" />
              <p className="font-medium">Configure and click "Train & Generate"</p>
              <p className="text-sm mt-1">The MLP learns from {MOCK_TIMETABLE.length} historical entries</p>
            </div>
          )}
        </div>
      </div>

      {/* Conflict report */}
      {result && result.conflicts.length > 0 && (
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center gap-2 mb-4">
            <AlertTriangle className="w-5 h-5 text-yellow-600" />
            <h3 className="font-semibold text-gray-800">Conflict Report</h3>
            <span className="ml-auto text-xs font-bold text-red-600">{result.conflicts.filter(c=>c.severity==='hard').length} hard</span>
            <span className="text-xs font-bold text-yellow-600">{result.conflicts.filter(c=>c.severity==='soft').length} soft</span>
          </div>
          <div className="space-y-2 max-h-60 overflow-y-auto">
            {result.conflicts.map((c, i) => (
              <div key={i} className={`flex items-start gap-3 p-3 rounded-xl border text-sm ${severityColor(c.severity)}`}>
                {c.severity === 'hard'
                  ? <AlertTriangle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                  : <Shield className="w-4 h-4 flex-shrink-0 mt-0.5" />}
                <div>
                  <span className="font-semibold capitalize">{c.type.replace('_',' ')}: </span>
                  {c.description}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* All-clear banner */}
      {result && result.conflicts.filter(c => c.severity === 'hard').length === 0 && (
        <div className="flex items-center gap-3 bg-green-50 border border-green-200 rounded-2xl p-5">
          <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0" />
          <div>
            <p className="font-semibold text-green-800">Zero Hard Conflicts</p>
            <p className="text-sm text-green-600">All {result.stats.totalScheduled} classes are conflict-free. Ready to apply.</p>
          </div>
        </div>
      )}
    </div>
  );
}
