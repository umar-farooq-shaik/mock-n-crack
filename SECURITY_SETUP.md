# Security Setup Guide

## 🔒 Database Security Status

### ✅ SECURED TABLES:
- **users** - Row Level Security (RLS) enabled
- **token_balance_changes** - RLS enabled  
- **technical_questions** - RLS enabled

### 🛡️ SECURITY POLICIES:
- Users can only view/modify their own data
- Service role (admin) can manage all data
- No public access to sensitive tables
- Proper permission grants for authenticated users

## 🚀 How to Apply Security Fixes

### Step 1: Run Database Security Script
1. Go to Supabase Dashboard → SQL Editor
2. Copy and paste `comprehensive_security_fix.sql`
3. Click Run

### Step 2: Deploy Updated Edge Functions
```bash
cd supabase
supabase functions deploy generate-question
supabase functions deploy seed-questions
```

## 🔐 Environment Variables Security

### Required Environment Variables:
Create a `.env` file in your project root:

```bash
# Supabase Configuration
VITE_SUPABASE_URL=https://iyljwzhuvcsmcpstbyqq.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here

# Gemini API Keys (for Edge Functions)
GEMINI_KEY_1=your-gemini-api-key-1
GEMINI_KEY_2=your-gemini-api-key-2
# ... add all 10 keys

# Supabase Service Keys (for Edge Functions only)
SUPABASE_URL=https://iyljwzhuvcsmcpstbyqq.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
SUPABASE_ANON_KEY=your-anon-key
```

### ⚠️ IMPORTANT:
- **NEVER commit `.env` files** to version control
- Add `.env` to your `.gitignore` file
- Keep service role keys secret (only for server-side)

## 🎯 What You Can Do After Security Fix

### ✅ ALLOWED:
- Edit your own `token_balance` in Supabase dashboard
- View your own user profile
- Update your own profile information
- Use the app normally with proper authentication

### ❌ BLOCKED:
- Access other users' data
- Modify other users' token balances
- View other users' profiles
- Anonymous access to sensitive data

## 🧪 Testing Security

### Test 1: Database Access
```sql
-- This should only show your own data
SELECT * FROM public.users WHERE auth.uid()::text = user_id::text;
```

### Test 2: Token Balance Update
```sql
-- This should work for your own user ID
SELECT update_token_balance_direct('your-user-uuid', 1500);
```

### Test 3: Cross-User Access (Should Fail)
```sql
-- This should fail with "You can only update your own token balance"
SELECT update_token_balance_direct('other-user-uuid', 1500);
```

## 🚨 Security Monitoring

### Check Current Status:
```sql
-- Verify RLS is enabled
SELECT schemaname, tablename, rowsecurity 
FROM pg_tables 
WHERE tablename IN ('users', 'token_balance_changes', 'technical_questions');

-- Check policies
SELECT * FROM pg_policies 
WHERE tablename IN ('users', 'token_balance_changes', 'technical_questions');
```

## 🔄 Maintenance

### Regular Security Checks:
1. **Monthly**: Review database policies
2. **Quarterly**: Audit user permissions
3. **After updates**: Verify RLS is still enabled

### If Security Breaks:
1. Run `comprehensive_security_fix.sql` again
2. Check for new tables that need RLS
3. Verify all policies are active

## 📞 Support

If you encounter security issues:
1. Check this guide first
2. Run the security verification queries
3. Contact support with specific error messages

---

**Remember**: Security is an ongoing process. Always verify after making changes!
