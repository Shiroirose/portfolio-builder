"use client";
import React, { useState, useEffect } from 'react';
import { driver } from 'driver.js';
import 'driver.js/dist/driver.css';
import { project, userInfo } from '../utils/schema'; 
import { db } from '../utils';
import { eq } from 'drizzle-orm';
import { useUser } from '@clerk/nextjs';

const Tour = () => {
  const { user } = useUser();
  const [getProject, setGetProject] = useState(false);
  const [showTour, setShowTour] = useState(false);

  const GetProject = async () => {
    try {
      const result = await db
        .select()
        .from(project)
        .where(eq(project.emailRef, user?.primaryEmailAddress.emailAddress));
      setGetProject(result.length > 0);
    } catch (error) {
      console.error("Failed to fetch projects:", error);
    }
  };

  const GetUserPreferences = async () => {
    try {
      const result = await db
        .select()
        .from(userInfo)
        .where(eq(userInfo.email, user?.primaryEmailAddress.emailAddress));
      if (result.length > 0) {
        console.log('state of tour', result[0].showtour);
        setShowTour(result[0].showtour);
      }
    } catch (error) {
      console.error("Failed to fetch user preferences:", error);
    }
  };

  useEffect(() => {
    if (user) {
      GetProject();
      GetUserPreferences();
    }
  }, [user]);

  useEffect(() => {
    if (showTour) {
      const steps = [
        { element: '#tour-example', popover: { title: 'TOURR!!', description: 'Take a look at how to navigate through the website', side: "right", align: 'start' } },
        { element: '#menu-Pages', popover: { title: 'Pages', description: 'Takes you to the admin page where you are!', side: "right", align: 'start' } },
        { element: '#menu-Style', popover: { title: 'Style', description: 'Set the theme of your portfolio. 0_0', side: "right", align: 'start' } },
        { element: '#menu-Stats', popover: { title: 'Stats', description: 'View analytics and statistics.', side: "right", align: 'start' } },
        { element: '#menu-Settings', popover: { title: 'Settings', description: 'Adjust application theme (for the website, not the portfolio T_T).', side: "right", align: 'start' } },
        { element: '#user-detail', popover: { title: 'Info abt you', description: 'The world wants to know more about you :)', side: "right", align: 'start' } },
        { element: '#camera-icon', popover: { title: 'Your DP', description: 'The world wants to see you :)', side: "right", align: 'start' } },
        { element: '#location-icon', popover: { title: 'Location', description: 'Set your location here.', side: "right", align: 'start' } },
        { element: '#link-icon', popover: { title: 'Link', description: 'Add a link to your portfolio or website.', side: "right", align: 'start' } },
        { element: '#linkedin-icon', popover: { title: 'LinkedIn', description: 'Add your LinkedIn profile here.', side: "right", align: 'start' } },
        { element: '#github-icon', popover: { title: 'GitHub', description: 'Link to your GitHub account.(PS:Add it to see your github activity, else a random will be shown :( )', side: "right", align: 'start' } },
        { element: '#git-activity', popover: { title: 'Your Activity', description: 'Toggle to show your contribution activity', side: "right", align: 'start' } },
        { element: '#add-project-button', popover: { title: 'Project', description: 'Add a project with its link. (add sample project to see rest)', side: "right", align: 'start' } },
      ];

      if (getProject) {
        steps.push(
          { element: '#project-pic', popover: { title: 'Project DP', description: 'Add an icon for your project', side: "right", align: 'start' } },
          { element: '#project-name', popover: { title: 'Name IT', description: 'Name of your project', side: "right", align: 'start' } },
          { element: '#project-desc', popover: { title: 'Describe', description: 'Your project too has a bio :P', side: "right", align: 'start' } },
          { element: '#project-drag', popover: { title: 'Drag and Drop', description: 'Drag your project up or down to reorder', side: "right", align: 'start' } },
          { element: '#project-link', popover: { title: 'Link it', description: 'Give a link', side: "right", align: 'start' } },
          { element: '#project-category', popover: { title: 'Category', description: 'Falls under which category?', side: "right", align: 'start' } },
          { element: '#project-stats', popover: { title: 'Project Visits', description: 'Number of visits ?', side: "right", align: 'start' } },
          { element: '#project-ai', popover: { title: 'AI', description: 'Use AI to write a description for your project !', side: "right", align: 'start' } },
          { element: '#project-delete', popover: { title: 'Delete', description: 'Well, Delete it :(', side: "right", align: 'start' } },
          { element: '#project-display', popover: { title: 'Display', description: 'Toggle to display on main portfolio (or not)', side: "right", align: 'start' } },
          { popover: { title: 'Happy Crafting !', description: 'Reload to see changes if not shown instantly :(' } },
          { popover: { title: 'Happy Crafting !', description: 'And that is all, go ahead and start crafting your portfolio.' } }
        );
      } else {
        steps.push({ popover: { title: 'Add PROJECT >_< !', description: 'to see other steps' } });
      }

      // steps.push(
      // );

      const driverObj = driver({
        showProgress: true,
        steps: steps
      });

      driverObj.drive();
    }
  }, [showTour, getProject]);

  return null;
};

export default Tour;
