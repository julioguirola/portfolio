import { useEffect, useState } from 'react';

const USERNAME = 'julioguirola';

type ContributionDay = {
  date: string;
  contributionCount: number;
  color: string;
};

type Weeks = ContributionDay[][];

const DAY_LABELS = ['', 'Lun', '', 'Mié', '', 'Vie', ''];
const MONTH_NAMES = [
  'Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun',
  'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic',
];

function useContributions() {
  const [weeks, setWeeks] = useState<Weeks>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(
          `https://github-contributions-api.deno.dev/${USERNAME}.json`,
        );
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}`);
        }
        const data = await response.json();
        if (!cancelled) {
          setWeeks(data.contributions ?? []);
        }
      } catch (e: any) {
        if (!cancelled) {
          setError(e?.message ?? 'Error al cargar contribuciones');
          console.error('Error fetching contributions:', e);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  return { weeks, loading, error };
}

function buildMonthLabels(weeks: Weeks): string[] {
  const labels: string[] = [];
  let lastMonth = -1;
  weeks.forEach((week) => {
    const date = new Date(week[0].date);
    const month = date.getMonth();
    if (month !== lastMonth) {
      labels.push(MONTH_NAMES[month]);
      lastMonth = month;
    } else {
      labels.push('');
    }
  });
  return labels;
}

const LEVEL_COLORS = [
  '#ebedf0',
  '#9be9a8',
  '#40c463',
  '#30a14e',
  '#216e39',
];

export default function GitHubContributionsReact() {
  const { weeks, loading, error } = useContributions();
  const monthLabels = weeks.length > 0 ? buildMonthLabels(weeks) : [];

  return (
    <section id="github-contributions" className="py-8 sm:py-20 bg-surface">
      <div className="mx-auto max-w-5xl px-4 sm:px-6">
        {/* SectionHeading inline */}
        <div className="mb-6 sm:mb-10">
          <span className="font-mono text-[10px] sm:text-xs font-medium text-accent-secondary tracking-wider uppercase">
            actividad
          </span>
          <h2 className="font-display text-3xl sm:text-4xl font-bold mt-1 sm:mt-2 text-text">
            Contribuciones en GitHub
          </h2>
        </div>

        <div className="flex flex-col items-center gap-8">
          <div className="text-center max-w-2xl">
            <p className="text-text-muted italic font-medium">
              "la práctica hace la perfección"
            </p>
          </div>

          {loading && (
            <p className="text-text-muted font-mono text-sm">
              Cargando contribuciones…
            </p>
          )}

          {error && !loading && (
            <p className="text-text-muted font-mono text-sm">
              No se pudieron cargar las contribuciones.
            </p>
          )}

          {!loading && !error && weeks.length > 0 && (
            <div className="w-full overflow-x-auto sm:overflow-visible pb-2 flex justify-start sm:justify-center">
              <div
                className="github-grid"
                style={{ ['--cols' as any]: weeks.length.toString() }}
              >
                {/* Month Labels */}
                <div
                  className="flex mb-1 sm:ml-8"
                  style={{
                    width:
                      'calc(var(--cols) * var(--cell) + (var(--cols) - 1) * var(--gap))',
                  }}
                >
                  {monthLabels.map((month, i) => (
                    <div
                      key={i}
                      className="month-label shrink-0"
                      style={{ width: 'var(--cell)', marginRight: 'var(--gap)' }}
                    >
                      {month}
                    </div>
                  ))}
                </div>

                <div className="flex" style={{ gap: 'var(--gap)' }}>
                  {/* Day Labels */}
                  <div
                    className="flex flex-col justify-between py-1 shrink-0"
                    style={{ height: 'calc(7 * var(--cell) + 6 * var(--gap))' }}
                  >
                    {DAY_LABELS.map((day, i) => (
                      <div
                        key={i}
                        className="day-label flex items-center shrink-0"
                        style={{ height: 'var(--cell)' }}
                      >
                        {day}
                      </div>
                    ))}
                  </div>

                  {/* Contribution Grid */}
                  <div
                    className="grid"
                    style={{
                      gap: 'var(--gap)',
                      gridTemplateColumns: `repeat(${weeks.length}, minmax(0, 1fr))`,
                    }}
                  >
                    {weeks.map((week, wi) => (
                      <div
                        key={wi}
                        className="flex flex-col"
                        style={{ gap: 'var(--gap)' }}
                      >
                        {week.map((day, di) => (
                          <div
                            key={di}
                            className="cell rounded-sm transition-colors duration-200 hover:ring-2 hover:ring-offset-1 hover:ring-accent cursor-pointer relative group"
                            style={{
                              backgroundColor: day.color,
                              width: 'var(--cell)',
                              height: 'var(--cell)',
                            }}
                            title={`${day.contributionCount} contribuciones el ${day.date}`}
                          >
                            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-text text-white text-[10px] rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-10">
                              {day.contributionCount} contribs · {day.date}
                            </div>
                          </div>
                        ))}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {!loading && !error && weeks.length > 0 && (
            <div className="flex items-center gap-2 text-[10px] sm:text-xs text-text-muted font-mono">
              <span>Menos</span>
              <div className="flex gap-0.5 sm:gap-1">
                {LEVEL_COLORS.map((color, i) => (
                  <div
                    key={i}
                    className="w-2 h-2 sm:w-3 sm:h-3 rounded-sm"
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>
              <span>Más</span>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
