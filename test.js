import test from 'ava';

import {readFileSync, readdirSync} from 'fs';
import junk from 'junk';
import path from 'path';
import postcss from "postcss";
import atomised from './src';
import perfectionist from "perfectionist";

const fixturePath = check => `./test/fixtures/${check}`;

const srcCSS = check => postcss([
    atomised({
        json: path.resolve('./test/output/', `${check}.json`)
    }),
    perfectionist({format: 'compact'})
]).process(readFileSync(`${fixturePath(check)}/src.css`, 'utf8'));

const expectedCSS = check => postcss([
    perfectionist({format: 'compact'})
]).process(readFileSync(`${fixturePath(check)}/expected.css`, 'utf8'));

const expectedMap = check => require(`${fixturePath(check)}/expected.json`);

readdirSync('test/fixtures').filter(junk.not).forEach(check => {
    test(check, t => srcCSS(check).then((result) => {
        const json = require(`./test/output/${check}.json`);
        t.is(result.css, expectedCSS(check).css);
        t.deepEqual(json, expectedMap(check));
    }));
});
