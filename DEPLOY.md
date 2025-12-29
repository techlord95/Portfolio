# How to Deploy Your Portfolio

To make your website accessible to everyone on any device, you need to deploy it to the internet. The best way to deploy a Next.js application is **Vercel**.

## Step 1: Push your code to GitHub
1. Create a repository on GitHub.
2. Push your current code to that repository.
   ```bash
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin <your-repo-url>
   git push -u origin main
   ```

## Step 2: Deploy on Vercel
1. Go to [Vercel](https://vercel.com) and sign up/login.
2. Click **"Add New..."** -> **"Project"**.
3. Import your GitHub repository.
4. Vercel will automatically detect that it's a Next.js project.
5. Click **"Deploy"**.

## Mobile & Tablet Support
- **Responsive Design**: The website has been updated to automatically adjust its layout for mobile phones and tablets.
- **Touch Support**: The custom cursor trail is automatically disabled on touch devices for a better user experience.

## Theme Customization
- Your robust theme editor allows you to change colors on the fly.
- These preferences are saved in your browser's local storage, so they persist across reloads.
