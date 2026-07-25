import React from 'react';

interface ProjectDetailsPanelProps {
  isOpen: boolean;
  onClose: () => void;
  project: 'career-compass' | 'skillometer' | 'exiles' | 'leaderboard' | 'stance';
}

export const ProjectDetailsPanel: React.FC<ProjectDetailsPanelProps> = ({ isOpen, onClose, project }) => {
  if (!isOpen) return null;

  const isCC = project === 'career-compass';
  const isSK = project === 'skillometer';
  const isEX = project === 'exiles';
  const isLB = project === 'leaderboard';

  return (
    <div
      id="project-details-panel"
      className="pointer-events-auto"
      style={{
        position: 'fixed',
        bottom: '48px',
        right: '48px',
        width: 'clamp(280px, 30vw, 420px)',
        maxHeight: 'calc(100vh - 96px)',
        overflowY: 'auto',
        borderRadius: '8px',
        padding: '24px',
        background: 'rgba(5, 5, 5, 0.75)',
        backdropFilter: 'blur(16px)',
        border: '1px solid rgba(255, 255, 255, 0.05)',
        color: 'var(--color-text-primary)',
        zIndex: 40,
        display: 'flex',
        flexDirection: 'column',
        gap: '20px',
        animation: 'slideIn 0.8s cubic-bezier(0.16, 1, 0.3, 1)',
      }}
    >
      {styleTag}

      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h3 className="text-heading" style={{ fontSize: '1rem', color: 'var(--color-brass)' }}>
          {isCC ? 'Career Compass Specification' : isSK ? 'Skillometer Specification' : isEX ? 'Exiles Specification' : isLB ? 'Leaderboard Specification' : 'Stance Specification'}
        </h3>
        <button
          onClick={onClose}
          aria-label="Close specification panel"
          style={{
            background: 'none',
            border: 'none',
            color: 'var(--color-text-secondary)',
            cursor: 'pointer',
            fontSize: '1rem',
            padding: '4px',
            transition: 'color 0.3s ease',
          }}
          onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--color-text-primary)')}
          onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--color-text-secondary)')}
        >
          ✕
        </button>
      </div>

      {/* Real Screenshots - Editorial Composition */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        <img
          src={
            isCC
              ? '/src/assets/images/careercompass.png'
              : isSK
              ? '/src/assets/images/skillometer..png'
              : isEX
              ? '/src/assets/images/exiles-chat.png'
              : isLB
              ? '/src/assets/images/leaderboard.png'
              : '/src/assets/images/stance-back.png'
          }
          alt={isCC ? 'Career Compass Interface' : isSK ? 'Skillometer Interface' : isEX ? 'Exiles Chat Interface' : isLB ? 'Leaderboard Interface' : 'Stance Interface'}
          style={{
            width: '100%',
            height: 'auto',
            borderRadius: '4px',
            border: '1px solid rgba(255, 255, 255, 0.08)',
          }}
        />
        {(!isEX && !isLB) && (
          <img
            src={isCC ? '/src/assets/images/career-compass-results.png' : isSK ? '/src/assets/images/skillometer.skitre.ai daf09edb8776.png' : '/src/assets/images/stance-womens.png'}
            alt={isCC ? 'Career Compass Results' : isSK ? 'Skillometer Analysis' : 'Stance Womens Health'}
            style={{
              width: '100%',
              height: 'auto',
              borderRadius: '4px',
              border: '1px solid rgba(255, 255, 255, 0.08)',
            }}
          />
        )}
      </div>

      {/* Problem & Solution */}
      <div>
        <h4 className="text-label" style={{ marginBottom: '6px', fontSize: '0.65rem' }}>Problem</h4>
        <p style={{ fontSize: '0.8rem', lineHeight: '1.5', color: 'rgba(245, 240, 232, 0.6)', marginBottom: '12px' }}>
          {isCC
            ? 'Conventional career guidance is static and prone to response bias.'
            : isSK
            ? 'Traditional talent validation relies on static resumes, failing to show the network of capability.'
            : isEX
            ? 'Distributed teams lack presence awareness. Communication happens without context of who is available or where conversations exist.'
            : isLB
            ? 'Competitive environments often lack clear, transparent progression systems that feel physically rewarding rather than punishing.'
            : 'Generic health platforms feel clinical and stressful. Digital wellbeing platforms rarely evoke an actual feeling of wellbeing.'}
        </p>

        <h4 className="text-label" style={{ marginBottom: '6px', fontSize: '0.65rem' }}>Solution</h4>
        <p style={{ fontSize: '0.8rem', lineHeight: '1.5', color: 'rgba(245, 240, 232, 0.6)' }}>
          {isCC
            ? 'Normalizes candidate traits across a multi-stage cognitive schema.'
            : isSK
            ? 'A graph-based living system that maps organic relationships between traits, signals, and roles.'
            : isEX
            ? 'A real-time presence and messaging infrastructure built on Supabase Realtime and idempotent delivery primitives.'
            : isLB
            ? 'A real-time, deduped ranking engine validating game events and broadcasting updates immediately.'
            : 'An abstract, soft, physically grounded digital sanctuary focusing on movement and recovery without healthcare tropes.'}
        </p>
      </div>

      {/* Role */}
      <div>
        <h4 className="text-label" style={{ marginBottom: '6px', fontSize: '0.65rem' }}>My Contribution</h4>
        <p style={{ fontSize: '0.8rem', lineHeight: '1.5', color: 'rgba(245, 240, 232, 0.6)' }}>
          {isCC
            ? 'Lead Product Engineer & Technical Architect. Designed the assessment schema, implemented Supabase SQL matching functions, built the React client, and integrated GPT-driven reasoning evaluation.'
            : isSK
            ? 'Lead Product Engineer, Creative Technologist, Motion Engineer. Engineered the dynamic relation schema, developed graph matching vectors, and implemented the R3F/Three.js visual network.'
            : isEX
            ? 'Lead Engineer. Designed the realtime channel architecture, idempotency system, presence tracking, and attachment schema on Supabase. Built the React frontend.'
            : isLB
            ? 'Lead Product Engineer & Three.js Engineer. Built the ranking engine, deduplication API, Supabase Edge Functions, and the kinetic 3D monolith architecture.'
            : 'Lead Product Engineer, Creative Technologist, Three.js Engineer, Motion Designer and Experience Architect. Engineered the entire sanctuary, interactive models, and the frontend GSAP scroll systems.'}
        </p>
      </div>

      {/* Tech Stack */}
      <div>
        <h4 className="text-label" style={{ marginBottom: '8px', fontSize: '0.65rem' }}>Technology Stack</h4>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
          {(isCC
            ? ['React', 'TypeScript', 'TailwindCSS', 'Supabase', 'PostgreSQL', 'OpenAI API']
            : isSK
            ? ['React', 'TypeScript', 'Three.js', 'R3F', 'GSAP', 'Supabase', 'PostgreSQL']
            : isEX
            ? ['React', 'TypeScript', 'Supabase Realtime', 'PostgreSQL', 'Lucide React', 'date-fns']
            : isLB
            ? ['React', 'TypeScript', 'Three.js', 'R3F', 'Supabase Edge Functions', 'PostgreSQL']
            : ['React', 'TypeScript', 'Three.js', 'R3F', 'GSAP', 'Framer Motion', 'TailwindCSS']
          ).map((tech) => (
            <span
              key={tech}
              style={{
                fontSize: '0.65rem',
                fontFamily: 'var(--font-mono)',
                background: 'rgba(255, 255, 255, 0.02)',
                border: '1px solid rgba(255, 255, 255, 0.05)',
                padding: '3px 8px',
                borderRadius: '4px',
                color: 'rgba(255, 255, 255, 0.5)',
              }}
            >
              {tech}
            </span>
          ))}
        </div>
      </div>

      {/* Engineering Blueprint */}
      <div>
        <h4 className="text-label" style={{ marginBottom: '6px', fontSize: '0.65rem' }}>Engineering Blueprint</h4>
        <ul style={{ display: 'flex', flexDirection: 'column', gap: '8px', padding: 0, margin: 0, listStyle: 'none' }}>
          {isCC ? (
            <>
              <li>
                <strong style={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '0.75rem' }}>JSONB Delta Scoring:</strong>
                <p style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)', marginTop: '2px' }}>
                  Tracks progress across assessments by executing JSONB diff queries inside PostgreSQL.
                </p>
              </li>
              <li>
                <strong style={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '0.75rem' }}>Multi-stage Normalization:</strong>
                <p style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)', marginTop: '2px' }}>
                  Filters user response bias via a 6-layer schema.
                </p>
              </li>
            </>
          ) : isSK ? (
            <>
              <li>
                <strong style={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '0.75rem' }}>Dynamic Relation Schema:</strong>
                <p style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)', marginTop: '2px' }}>
                  Constructs real-time relationship graphs between traits and capability signals.
                </p>
              </li>
              <li>
                <strong style={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '0.75rem' }}>Graph Matching Vectors:</strong>
                <p style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)', marginTop: '2px' }}>
                  Evaluates role alignment using cosine similarity vector operations over normalized capabilities.
                </p>
              </li>
            </>
          ) : isEX ? (
            <>
              <li>
                <strong style={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '0.75rem' }}>Idempotency Key System:</strong>
                <p style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)', marginTop: '2px' }}>
                  UUID-based idempotency keys prevent duplicate messages on network retries, enforced at the PostgreSQL RPC layer.
                </p>
              </li>
              <li>
                <strong style={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '0.75rem' }}>Supabase Realtime Channels:</strong>
                <p style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)', marginTop: '2px' }}>
                  Per-conversation channels with postgres_changes subscriptions for INSERT events across messages, edits, and deletions.
                </p>
              </li>
              <li>
                <strong style={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '0.75rem' }}>Sequence ID Ordering:</strong>
                <p style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)', marginTop: '2px' }}>
                  Multi-layer chronological ordering via sequence_id resolves simultaneous message conflicts deterministically.
                </p>
              </li>
            </>
          ) : isLB ? (
            <>
              <li>
                <strong style={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '0.75rem' }}>Deduplication Engine:</strong>
                <p style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)', marginTop: '2px' }}>
                  Score Submission API running on Edge Functions to deduplicate and validate incoming game events.
                </p>
              </li>
              <li>
                <strong style={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '0.75rem' }}>Ranking & Caching:</strong>
                <p style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)', marginTop: '2px' }}>
                  Optimized SQL ranking engine broadcasting immediate updates via postgres_changes.
                </p>
              </li>
            </>
          ) : (
            <>
              <li>
                <strong style={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '0.75rem' }}>GSAP Scroll Pipeline:</strong>
                <p style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)', marginTop: '2px' }}>
                  Highly optimized scroll-driven animation timeline managing Three.js canvas state and DOM elements concurrently without layout thrashing.
                </p>
              </li>
              <li>
                <strong style={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '0.75rem' }}>Translucent Material Optimization:</strong>
                <p style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)', marginTop: '2px' }}>
                  Custom physical materials balancing rendering cost with the high aesthetic requirement of frosted, breathable glass forms.
                </p>
              </li>
            </>
          )}
        </ul>
      </div>

      {/* Lessons Learned */}
      <div>
        <h4 className="text-label" style={{ marginBottom: '6px', fontSize: '0.65rem' }}>Lessons Learned</h4>
        <p style={{ fontSize: '0.8rem', lineHeight: '1.5', color: 'var(--color-text-secondary)' }}>
          {isCC
            ? 'Mitigating cognitive overload is critical. Clean progressive disclosures dramatically increased completion rates compared to dense dashboards.'
            : isSK
            ? 'Understanding human capabilities requires organic structures, not rigid dashboards.'
            : isEX
            ? 'Presence must be established before conversation. Designing for awareness first changed how users relate to the communication space entirely.'
            : isLB
            ? 'Improvement has weight. Translating digital scores into physical, architectural weight makes progress feel significant rather than transient.'
            : 'Performance is a design feature. If a health platform stutters or drops frames, it inherently induces stress, completely undermining its own purpose.'}
        </p>
      </div>
    </div>
  );
};

const styleTag = (
  <style>{`
    @keyframes slideIn {
      from { transform: translateX(20px); opacity: 0; }
      to { transform: translateX(0); opacity: 1; }
    }
  `}</style>
);
