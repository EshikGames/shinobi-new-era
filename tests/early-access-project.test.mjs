import assert from "node:assert/strict";
import test from "node:test";
import {
  EARLY_ACCESS_SUPABASE_PROJECT_REF,
  EARLY_ACCESS_SUPABASE_URL,
  isEarlyAccessSupabaseTarget,
} from "../lib/early-access/project.mjs";

test("Early Access accepts only the dedicated Supabase project", () => {
  assert.equal(EARLY_ACCESS_SUPABASE_PROJECT_REF, "avdkvtmugeizoqqvayek");
  assert.equal(isEarlyAccessSupabaseTarget(EARLY_ACCESS_SUPABASE_PROJECT_REF, EARLY_ACCESS_SUPABASE_URL), true);
  assert.equal(isEarlyAccessSupabaseTarget(EARLY_ACCESS_SUPABASE_PROJECT_REF, `${EARLY_ACCESS_SUPABASE_URL}/`), true);
  assert.equal(isEarlyAccessSupabaseTarget("aymbbkvxtidyxarcesyo", EARLY_ACCESS_SUPABASE_URL), false);
  assert.equal(isEarlyAccessSupabaseTarget(EARLY_ACCESS_SUPABASE_PROJECT_REF, "https://aymbbkvxtidyxarcesyo.supabase.co"), false);
  assert.equal(isEarlyAccessSupabaseTarget(EARLY_ACCESS_SUPABASE_PROJECT_REF, `${EARLY_ACCESS_SUPABASE_URL}/rest/v1`), false);
  assert.equal(isEarlyAccessSupabaseTarget(EARLY_ACCESS_SUPABASE_PROJECT_REF, `${EARLY_ACCESS_SUPABASE_URL}/?key=unexpected`), false);
  assert.equal(isEarlyAccessSupabaseTarget(EARLY_ACCESS_SUPABASE_PROJECT_REF, EARLY_ACCESS_SUPABASE_URL.replace("https:", "http:")), false);
});
