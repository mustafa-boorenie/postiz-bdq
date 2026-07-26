'use client';

import { FC, FormEventHandler, useCallback, useState } from 'react';
import { useFetch } from '@gitroom/helpers/utils/custom.fetch';
import { useToaster } from '@gitroom/react/toaster/toaster';
import { useT } from '@gitroom/react/translation/get.transation.service.client';
import { Button } from '@gitroom/react/form/button';
import { Select } from '@gitroom/react/form/select';
import { Input } from '@gitroom/react/form/input';

type LookbackOption = '90d' | '6m' | '1y' | '2y';

type ImportHistoryResponse = {
  fetched: number;
  imported: number;
  skipped: number;
};

export const ImportHistoryModal: FC<{
  integrationId: string;
  close: () => void;
  onDone?: () => void;
}> = ({ integrationId, close, onDone }) => {
  const fetch = useFetch();
  const toaster = useToaster();
  const t = useT();
  const [lookback, setLookback] = useState<LookbackOption>('1y');
  const [limit, setLimit] = useState(100);
  const [importing, setImporting] = useState(false);

  const submit: FormEventHandler<HTMLFormElement> = useCallback(
    async (e) => {
      e.preventDefault();
      setImporting(true);

      try {
        const since = new Date();
        if (lookback === '90d') {
          since.setDate(since.getDate() - 90);
        }
        if (lookback === '6m') {
          since.setMonth(since.getMonth() - 6);
        }
        if (lookback === '1y') {
          since.setFullYear(since.getFullYear() - 1);
        }
        if (lookback === '2y') {
          since.setFullYear(since.getFullYear() - 2);
        }

        const response = await fetch(`/integrations/${integrationId}/import-history`, {
          method: 'POST',
          body: JSON.stringify({
            since: since.toISOString(),
            limit: Math.min(500, Math.max(1, limit || 1)),
          }),
        });

        if (!response.ok) {
          let message = t('import_history_failed', 'Failed to import past posts');
          try {
            const error = await response.json();
            message = Array.isArray(error?.message)
              ? error.message.join(', ')
              : error?.message || message;
          } catch {
            /** keep fallback message **/
          }
          throw new Error(message);
        }

        const data = (await response.json()) as ImportHistoryResponse;
        toaster.show(
          `Imported ${data.imported} posts (${data.skipped} already present)`,
          'success'
        );
        onDone?.();
        close();
      } catch (error: unknown) {
        toaster.show(
          error instanceof Error
            ? error.message
            : t('import_history_failed', 'Failed to import past posts'),
          'warning'
        );
      } finally {
        setImporting(false);
      }
    },
    [lookback, limit, fetch, integrationId, toaster, t, onDone, close]
  );

  return (
    <form onSubmit={submit} className="flex flex-col gap-[16px] min-w-[420px]">
      <div className="text-[14px] text-textColor/70">
        {t(
          'import_history_explanation',
          'Past Instagram posts published outside Postiz will be added to the calendar as published posts, so their analytics become viewable.'
        )}
      </div>

      <Select
        label={t('lookback', 'Lookback')}
        name="lookback"
        disableForm={true}
        hideErrors={true}
        value={lookback}
        onChange={(e) => setLookback(e.target.value as LookbackOption)}
      >
        <option value="90d">{t('last_90_days', 'Last 90 days')}</option>
        <option value="6m">{t('last_6_months', 'Last 6 months')}</option>
        <option value="1y">{t('last_year', 'Last year')}</option>
        <option value="2y">{t('last_2_years', 'Last 2 years')}</option>
      </Select>

      <Input
        label={t('max_posts', 'Max posts')}
        name="limit"
        type="number"
        min={1}
        max={500}
        value={limit}
        disableForm={true}
        removeError={true}
        onChange={(e) => setLimit(+e.target.value)}
      />

      <div className="flex justify-end gap-[10px] pt-[8px] border-t border-tableBorder">
        <Button
          type="button"
          onClick={close}
          className="bg-transparent border border-tableBorder text-textColor"
        >
          {t('cancel', 'Cancel')}
        </Button>
        <Button type="submit" disabled={importing} loading={importing}>
          {t('import', 'Import')}
        </Button>
      </div>
    </form>
  );
};
